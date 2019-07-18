# Deployment

Deploying the CRUD/search API on a VM for worldwide access. Any deviations from the book's configurations vs what
I plan on doing or have decided to use will be noted, along with reasoning when appropriate.

<br><br>



--------------------------------------------------------------------------------
### VPS Deployment: Config Notes

__Books goals:__

- Expose the API to the web...
- Using DigitalOcean VPS...
- With a purchased domain...
- With proper DNS configuration.

Requirements translated: <br>

   Secure a VPS with Ubuntu. Learn privileged ports. Handle state managed with __PM2__. Use NGINX as a<br>
   reverse proxy to the API understand DNS architecture.

<br><br>



__I will be using a VirtualBox VM, managed locally__

   And that should hopefully be able to mimic this.

   I'll connect to it through a reverse tunnel for __rsub__ support

  ```
  alias ssh='ssh -R 52698:localhost:52698 admin@127.0.0.1 -p <port>'

  $ ssh
  > admin@127.0.0.1 password: ...
  ```

   The VBox VM is sitting at `10.0.3.15`. Node is already installed, but may take some finangling, <br>
   local is v10.15.3, VM is v8.16.0. Elasticsearch is also already installed and is apparently running

  ```
  $ curl http://localhost:9200
  $ systemctl status elasticsearch
  ```

   Further, DigitalOcean provides some sort of dashboard for service management: VPS, DNS, block <br>
   storage, monitoring, Kubernetes...this may be a bump in the road to solve in the future. I have a  <br>
   live environment on Linode already for my site.

<br><br>



__Hostname & address__

   Coincidentally the author is using the same string as his workhorse user: `hobnob @142.93.241.63`

   Note about server names: Keep a sensible naming convention

  ```
  <environment>.<feature>.<function><replica>
  ```

   Example: machine acting as a load balancer for auth service in the staging env

  ```
  staging.auth.lb1
  ```

   Benefit: easier visual queues in the terminal:

  ```
  hobnob@staging.auth.lb1:-$
  ```

   More 'annecdotes': https://www.ietf.org/rfc/rfc1178

<br><br>



__Document structure for commands__

   For commands to remote:`<user>@hobnob $`. Otherwise, for local commands: `$`.

<br><br>



--------------------------------------------------------------------------------
### VPS Deployment: Security



__Reduced priv user__

   Create `hobnob` then push into sudo group: `# usermod -aG sudo hobnob`.

<br><br>



__Use PKI auth for SSH__

   My machines have already been secured in this manner, but I'll still take notes. _Knowledge Is Power_.

   The `ssh-agent` will be in charge of holding private keys. Each development machine should have its<br>
   own key. Start with checking for existing keys:

  ```
  $ cd ~/.ssh/ && ls -ahl    # this is where keys are normally stored by default
  ```

   Then build the key, using the default location for storage and using the 4,096 bit length RSA <br>
   algorithm. Set the additional passphrase when prompted, we're not in a situation where the program<br>
   will run inside an environment where user input isn't possible

  ```
  # Note: this is a local command, obviously you want the priv SSH key not to be shared

  $ ssh-keygen -t rsa -b 4096 -C email@address.com
  > ...
  > Your identification has been saved in $HOME/.shh/id_rsa.    # the private key
  > Your public key has been saved in $HOME/.ssh/id_rsa.pub.    # the public key
  ```

   Grab the public key as a string and copy it to your clipboard

  ```
  $ cat ~/.ssh/id_rsa.pubssh-rsa.pub
  > ssh-rsa ....    # <-- copy this string of characters

  # or..

  $ xclip -selection clipboard < ~/.ssh/id_rsa.pub
  ```


<br>

Formatting note: I tried to prettify the results of the MD render, but I'm giving up.

<br>

After getting your pub key, create a home for it if there isn't one already existing

  ```
  remote:# mkdir ~/.ssh
  remote:# touch ~/.ssh/authorized_keys
  ```

Lock the file down to `root` access only

  ```
  remote:# chmod 700 ~/.ssh
  remote:# chmod 600 ~/.ssh/authorized_keys
  ```

Append pub key to the end of `authorized_keys`, reload the service and test it

  ```
  remote:# vi ~/.ssh/authorized_keys
    // or, on my systems...
  remote:# rsub !$
    // make chnges locally, save and scp the file automatically
  remote:# systemctl reload ssh.service    # sshd.service for CentOS?
    // start a new terminal session, then test
  $ ssh root@ip
  remote:#
  ```

Repeat for the `hobnob` user with `ssh-copy-id` tool

  ```
  $ ssh-copy-id hobnob@ip
  ```

Verify you can log into both accounts from new sessions.

<br><br>



__Additional Security__

Open conf file for SSH daemon at `/etc/ssh/sshd_config` ( Note: not the conf for SSH client `ssh_config` ) and set the following. Reload with `systemctl` and attempt to log back in after saving and closing.

  ```

  PasswordAuthentication no

  ...

  PermitRootLogin no
  ```

  ```
  $ ssh root@ip
  > Permission denied (publickey)
  ```


<br><br>



__Firewall__

_All exposed ports are potential vulnerabilities._

Ubuntu uses `ufw` program

> __u__ ncompliacted <br>
> __f__ ire          <br>
> __w__ all          <br>

Services can register `ufw` profiles. Instead of specifying ports, use the profiles

  ```
  hobnob@remote:# sudo ufw status
  > Inactive
  hobnob@remote:# sudo ufw allow 22    # <- nope
  hobnob@remote:# sudo ufw app list
  > Available applications:
  >   OpenSSH
  hobnob@remote:# sudo ufw allow OpenSSH    # <- yep
  > Rules updated
  hobnob@remote:# sudo ufw enable
  hobnob@remote:# sudo ufw status
  > Active
  ```

I use CentOS, so this is definitely not revlevant.

<br><br>



--------------------------------------------------------------------------------
### VPS Deployment: Wrapup

__Time Zone & NTP__

Not exactly security related, but /shrug

  ```
  hobnob@remote:# sudo dpkg-reconfigure tzdata
    # up/dwn arrow to select: Geo Area -> None, City or Region -> UTC
  > Current default time zone: 'Etc/UTC'
  ```

Then sync with global NTP servers with the `ntp` daemon. Install, it will set to start on boot automatically.

  ```
  hobnob@remote:# sudo apt update
  hobnob@remote:# sudo apt install ntp
  ```

This will also manage the server's time zone and make changes if appropriate. For CentOS:

  ```
  jsore:# date
  > <outputs date/time>
  jsore:# ls -l /etc/localtime
  > <fileperms> Jan 3 2018 /etc/localtime -> ../usr/share/zoneinfo/America/New_York

  # or
  jsore:# timedatectl
  jsore:# timedatectl | grep -i 'time zone'

  # oops, I'm based in Dallas TX and it's July 18th 2019 right now...

  # list available zones
  jsore:# timedatectl list-timezones | grep America

  # or just set to UTC
  jsore:# timedatectl set-timezone UTC
  ```

I've omitted CentOS NTP setup because it's fairly in depth and I'm only running a VBox VM, not a live server. Guide:
https://www.digitalocean.com/community/tutorials/how-to-configure-ntp-for-use-in-the-ntp-pool-project-on-centos-7

<br><br>



--------------------------------------------------------------------------------
### Running The API

Software and their library dependencies installations ( Git, Node, Yarn, Java JDK, Elasticsearch )

  ```
  remote:$ curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
  remote:$ echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
  remote:$ sudo apt update && sudo apt install yarn git default-jdk
  remote:$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
  remote:$ echo 'JAVA_HOME="/usr/lib/jvm/java-8-openjdk-amd64"' | sudo tee --append /etc/environment > /dev/null
  remote:$ cd && wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-6.3.2.deb
  remote:$ sudo dpkg -i elasticsearch-6.3.2.deb
  remote:$ rm elasticsearch-6.3.2.deb
  remote:$ sudo systemctl start elasticsearch.service
  remote:$ sudo systemctl status elasticsearch.service

  // TODO: add CentOS instructions

  ```

Application code should reside within `/home/hobnob/` and run as `hobnob` to avoid permission issues.

  ```
  remote:$ cd && mkdir projects && cd projects             # create a home
  remote:$ git clone https://github.com/d4nyll/hobnob.git  # clone the API repo
  remote:$ cd hobnob && nvm install && yarn                # install Node and dependencies, then serve
  ```

   Note: `nvm` can't be used if API is placed outside of the user's home directory, such as `/srv/` or <br>
   `/var/www/` because `nvm` installs the Node.js binary under the installer's home directory. As an   <br>
   alternative, install Node globally with the npm package `n`.

   __Do not run API as `root`, which poses a huge security risk__

<br><br>



--------------------------------------------------------------------------------
### Replication TODO's

The goal of this whole writeup is to learn tips on how to redeploy a beefier version of my website. I've decided to move forward and begin migrating to a new server, starting from scratch, but with some changes from what the book is doing.

<br>


- [ ] Spin up a new Linode VM, CentOS 7.6.x

      _Book deviation: Digitial Ocean, Ubuntu 18.04_

<br>


- [ ] Running CentOS 7.6.x, 2 CPU/80GB HDD/4GB RAM ( $20/mo )

      _Book deviation: Ubuntu 18.04.x, 4GB RAM_

      _Elasticsearch is memory intensive, suggested RAM config of 16-64GB. That's out_ <br>
      _of scope for my private server I'll be running, too expensive to justify for a_ <br>
      _portfolio. Will still be an upgrade from the current server I'm running though,_ <br>
      _currently 1 CPU/50GB HDD/2GB RAM @ $10/mo._

<br>

- [ ] Future proofed host naming conventions, current: `cent.jsore.com`

<br>


- [ ] 2FA on Linode account

<br>


- [ ] New SSH keys, `sshd` lockdown but still over port 22

<br>


- [ ] Lockdown `firewalld`

<br>


- [ ] Configure `rsub`

<br>


- [ ] Configure `bashrc`

<br>


- [ ] GitHub integration shouldn't be needed maybe?

<br>


- [ ] Domain needs to be transferred off existing server, finish book's DNS sections prior to though

      _Curious to see what difference the author implemented in their DNS configs. I'm_<br>
      _competent, have a full working DNS config set, but haven't played with reverse_ <br>
      _proxies before, don't know if that'll conflict._

<br>


- [ ] Mail server migration

      _Need to make a decision here: should I keep my original $10/mo box, wipe it and_ <br>
      _hand roll an mail solution or continue to use Fastmail and point that service_   <br>
      _at the new box? Logic would dictate that since I'm advertising myself as a full_ <br>
      _stack dev I should back that up, but...until that decision has been made I'll_   <br>
      _just continue using Fastmail, specially since I'm job hunting currently and_     <br>
      _need it available reliably._

<br>


- [ ] HTTPS via NGINX reverse proxy

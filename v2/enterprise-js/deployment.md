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

   ~~And that should hopefully be able to mimic this.~~

   I'll connect to it through a reverse tunnel for __rsub__ support

  ```
  alias ssh='ssh -R 52698:localhost:52698 admin@127.0.0.1 -p <port>'

  $ ssh
  > admin@127.0.0.1 password: ...
  ```

   ~~The VBox VM is sitting at `10.0.3.15`. Node is already installed, but may take some finangling,~~ <br>
   ~~local is v10.15.3, VM is v8.16.0. Elasticsearch is also already installed and is apparently running~~

      I decided to just go with what the book is learning and get familiar with Ubuntu.

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

   I'll be going with `foundation` for my new Linode instance's hostname.

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

~~I use CentOS, so this is definitely not revlevant.~~

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

~~I've omitted CentOS NTP setup because it's fairly in depth and I'm only running a VBox VM, not a live server. Guide:~~
https://www.digitalocean.com/community/tutorials/how-to-configure-ntp-for-use-in-the-ntp-pool-project-on-centos-7

<br><br>



--------------------------------------------------------------------------------
### Running The API

Software and their library dependencies installations ( Git, Node, Yarn, Java JDK, Elasticsearch )

> Note: The book is using Elasticsearch 6.3.2, I replicated my Mac's environment and used 6.8.0

  ```
  remote:$ curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
  remote:$ echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
  remote:$ sudo apt update && sudo apt install yarn git default-jdk
  remote:$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
  remote:$ echo 'JAVA_HOME="/usr/lib/jvm/java-8-openjdk-amd64"' | sudo tee --append /etc/environment > /dev/null
  remote:$ cd && wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-6.8.0.deb
  remote:$ sudo dpkg -i elasticsearch-6.8.0.deb
  remote:$ rm elasticsearch-6.8.0.deb
  remote:$ sudo systemctl start elasticsearch.service
  remote:$ sudo systemctl status elasticsearch.service
  ```

Application code should reside within `/home/hobnob/` and run as `hobnob` to avoid permission issues.

  ```
  remote:$ cd && mkdir projects && cd projects             # create a home
  remote:$ git clone https://github.com/<path>/hobnob.git  # clone the API repo
  remote:$ cd hobnob && nvm install && yarn                # install Node and dependencies, then serve
  ```

   Note: `nvm` can't be used if API is placed outside of the user's home directory, such as `/srv/` or <br>
   `/var/www/` because `nvm` installs the Node.js binary under the installer's home directory. As an   <br>
   alternative, install Node globally with the npm package `n`.

   __Do not run API as `root`, which poses a huge security risk__

Then, set the env variables. Book says `*.env.example` should work out of the box, but my environment differs

  ```
  remote:$ cd env/
  remote:$ cp .env.example .env
  remote:$ cp test.env.example test.env
  remote:$ cd ../ && yarn run serve
  ```

Site should be running, but the firewall still needs to be opened

  ```
  remote:$ sudo ufw allow 8080
  ```

<br><br>



--------------------------------------------------------------------------------
### PM2 Integration

The Node process is currently being ran in an ephemeral SSH session, errors are fatal and there's no hooks in place to auto restart the app. Ubuntu's `upstart` daemon and npm package `forever` can solve this, but PM2 seems to be the most complete process manager.

Install PM2 as a development dependency

  ```
  $ yarn add pm2 --dev
  ```

Update `serve` script to execute `pm2 start` instead of `node`

  ```
  // from
  "serve": "yarn run build && dotenv -e envs/.env node dist/index.js",
  // to
  "serve": "yarn run build && dotenv -e envs/.env pm2 start dist/index.js"
  ```

Push the local changes and pull them into the VM

  ```
  $ git add -A && git commit -m "Add PM2 process manager"

  $ git checkout master
  $ git merge --no-ff dev
  $ git push

  jsore@foundation:hobnob:$ git remote -v
  > origin  https://github.com/jsore/hobnob.git (fetch)
  > origin  https://github.com/jsore/hobnob.git (push)

  jsore@foundation:hobnob:$ git pull --no-commit origin
  ```

Re-run `yarn` to install `pm2` and re-serve it

  ```
  jsore@foundation:hobnob:$ yarn
  jsore@foundation:hobnob:$ yarn run serve
  > ...
  > ┌───────┬────┬──────┬────────┬─────────┬─────┬───────────┐
  > │ Name  │ id │ mode │ status │ restart │ cpu │ memory    │
  > ├───────┼────┼──────┼────────┼─────────┼─────┼───────────┤
  > │ index │ 0  │ fork │ online │ 0       │ 0%  │ 29.8 MB   │
  > └───────┴────┴──────┴────────┴─────────┴─────┴───────────┘
  ```

Process is now being managed by PM2 instead of `jsore` user.

<br>


__PM2 CLI Reference__

Pull up the CLI tool dashboard ( mouse-over interaction )

  ```
  jsore@foundation:hobnob:$ npx pm2 monit
  ┌─ Process list ─────────────────────────────────────┐┌─ Global Logs ────────────────────────────────────────┐
  │[ 0] index         Mem:  51 MB    CPU:  0 %  online ││ index > Hobnob API server running on port 8080.      │
  │                                                    ││                                                      │
  └────────────────────────────────────────────────────┘└──────────────────────────────────────────────────────┘
  ┌─ Custom metrics (http://bit.ly/code-metrics) ─┐┌─ Metadata ─ ──────────────────────────────────────────────┐
  │ Heap Size                              20.29  ││ App Name      index                                       │
  │ Heap Usage                             73.36  ││ Version       0.1.0                                       │
  │ Used Heap Size                         14.88  ││ Restarts      1                                           │
  │ Active requests                            0  ││ Uptime        34m                                         │
  │ Active handles                             4  ││ Script path   /home/jsore/projects/hobnob/dist/index.js   │
  │ Event Loop Latency                      0.96  ││ Script args   N/A                                         │
  └───────────────────────────────────────────────┘└───────────────────────────────────────────────────────────┘
   left/right: switch boards | up/down/mouse: scroll | Ctrl-C: exit     To go further check out https://pm2.io/
  ```

Kill a process manaully to see PM2's process restart in action

  ```
  jsore@foundation:hobnob:$ npx pm2 list
  ┌───────┬────┬───────┬──────┬────────┬─────────┬─────┬───────────┐
  │ Name  │ id │ pid   │ mode │ status │ restart │ cpu │ memory    │
  ├───────┼────┼───────┼──────┼────────┼─────────┼─────┼───────────┤
  │ index │ 0  │ 19747 │ fork │ online │ 0       │ 0%  │ 50.1 MB   │
  └───────┴────┴───────┴──────┴────────┴─────────┴─────┴───────────┘

  jsore@foundation:hobnob:$ kill 19747

  jsore@foundation:hobnob:$ npx pm2 list    # note the updated PID
  ┌───────┬────┬───────┬──────┬────────┬─────────┬─────┬───────────┐
  │ Name  │ id │ pid   │ mode │ status │ restart │ cpu │ memory    │
  ├───────┼────┼───────┼──────┼────────┼─────────┼─────┼───────────┤
  │ index │ 0  │ 21263 │ fork │ online │ 1       │ 0%  │ 50.1 MB   │
  └───────┴────┴───────┴──────┴────────┴─────────┴─────┴───────────┘
  ```

Automatically restart PM2 itself should it be terminated ( ex: during reboot )

  ```
  jsore@foundation:hobnob:$ npx pm2 startup
  [PM2] Init System found: systemd
  [PM2] To setup the Startup Script, copy/paste the following command:
  sudo env PATH=$PATH:/home/jsore/.nvm/ ... startup systemd -u jsore --hp /home/jsore

  # run what it told you to
  jsore@foundation:hobnob:$ sudo env PATH=$PATH:/home/jsore/.nvm/versions/node/v10.15.3/bin /home/jsore/projects/hobnob/node_modules/pm2/bin/pm2 startup systemd -u jsore --hp /home/jsore
  > [PM2] Init System found: systemd
  > ...
  > Target path
  > /etc/systemd/system/pm2-jsore.service
  > Command list
  > [ 'systemctl enable pm2-jsore' ]
  > [PM2] Writing init configuration in /etc/systemd/system/pm2-jsore.service
  > [PM2] Making script booting at startup...
  > [PM2] [-] Executing: systemctl enable pm2-jsore...
  > Created symlink /etc/systemd/system/multi-user.target.wants/pm2-jsore.service → /etc/systemd/system/pm2-jsore.service.
  > [PM2] [v] Command successfully executed.
  ```

<br><br>



--------------------------------------------------------------------------------
### Standardized ( Privileged ) Ports

API is currently running on `8080` but standard API requests go to `80` So, change `SERVER_PORT` entry within `envs/.env` to `=80` then delete the app and re-run `serve`

  ```
  $ git add -A && git commit -m "Update Express listen port"
  $ git checkout master && git merge --no-ff dev && git push
  # i was actually on master branch when I made the change, not dev, so actually:
  $ git checkout dev && git pull origin master:dev

  # ... scratch that, git isn't tracking /envs/*, manual update to local and remote required
  ```

This won't entirely fix the issue because port `80` is a priviledged port and Node by default doesn't have permission to access that port. The PM2 process will fail after 15 restart attempts. Confirm the issue is indeed an `EACCES` issue from the logs

  ```
  jsore@foundation:hobnob:$ tail -n11 /home/jsore/.pm2/logs/index-error.log
  >    at Object.<anonymous> (/home/jsore/projects/hobnob/dist/index.js:136:20)
  >    at Module._compile (internal/modules/cjs/loader.js:701:30)
  >    at Object.Module._extensions..js (internal/modules/cjs/loader.js:712:10)
  >    at Module.load (internal/modules/cjs/loader.js:600:32)
  >    at tryModuleLoad (internal/modules/cjs/loader.js:539:12)
  >    at Function.Module._load (internal/modules/cjs/loader.js:531:3)
  >  code: 'EACCES',
  >  errno: 'EACCES',
  >  syscall: 'listen',
  >  address: '0.0.0.0',
  >  port: 80 }
  ```

Remember to try to solve this by running the Node process as `root`. Should someone find a vulnerability in the app then exploit it, they'd be able to do everything `root` could on the server. Mitigate this risk by always running the process as a normal user.

<br>


__Option 1: Hack to de-escalate privileges__

Initiate the process as `root` with `sudo` then update user and group identities of the process later

  ```javascript
  // set env variables SUDO_UID and SUDO_GID, then:
  app.listen(process.env.SERVER_PORT, async () => {
    const sudoGid = parseInt(process.env.SUDO_GID);
    const sudoUid = parseInt(process.env.SUDO_UID);
    if (sudoGid) { process.setuid(sudoGid) }
    if (sudoUid) { process.setuid(sudoUid) }
    ...
  });
  ```

<br>


__Option 2: Set capabilities__

When a process requires privileges to do something it checks with a list of capabilities. If it has it, it can run. Instead of running as `root`, you can grant Node processes a capability, for example, binding to privileged ports

  ```
  # set
  jsore@foundation:hobnob:$ sudo setcap CAP_NET_BIND_SERVICE=+ep $(which node)
  # confirm
  jsore@foundation:hobnob:$ sudo getcap $(which node)
  > ~/.nvm/versions/node/v8.9.0/bin/node = cap_net_bind_service+ep
  jsore@foundation:hobnob:$ npx pm2 delete 0; yarn run serve    # should bind to port 80 successfully
  ```

Major fallbacks: If Node.js version gets updated with nvm, capabilities need to be re-set for the new version. Plus, this capability allows binding to _all_ privileged ports, a potential vulnerability. To unset run `sudo setcap -r $(which node)`

<br>


__Option 3: Use authbind utility to set capabalities__

`authbind` lets users without superuser permissions access to privileged network services with better control

  ```
  jsore@foundation:hobnob:$ sudo apt install authbind

  # if the user can access the <port> file, they can bind to it
  jsore@foundation:hobnob:$ sudo touch /etc/authbind/byport/80

  # bring the configuration file under the user running API server...
  jsore@foundation:hobnob:$ sudo chown jsore /etc/authbind/byport/80

  # ...and grant access only to that user, readonly
  jsore@foundation:hobnob:$ sudo chmod 500 /etc/authbind/byport/80

  jsore@foundation:hobnob:$ npx pm2 delete 0; authbind --deep yarn run serve
  ```

<br>


__Option 4: Use iptables to redirect traffic__

Route all traffic entering on `80` to `8080`

  ```
  jsore@foundation:hobnob:$ sudo iptables -t nat -I PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8080
  ```

<br>


__Option 5: Use a reverse proxy server to redirect port -> port__ ( preferred method )

Proxies are intermediary servers used by clients to indeirectly access other servers. A proxy 'acts' as the client.

Reverse proxies are the same, but flipped around

  ```
  Reverse
   Proxy
     ⬇

  1. Reverse proxy receives request
  2. It relays request to proxied service ( eg: Express app )
  3. It receives the response from the service
  4. It sends the response back to the client(s)

    ⬆
  Proxy
  ```

Client is oblivious, to it the response came directly from the reverse proxy.

NGINX is the most popular service to achieve this option. It's scalable, can function as a web server and as a proxy to reduce the load on back-end HTTP or mail servers.

<br><br>



--------------------------------------------------------------------------------
### NGINX & DNS

Ubuntu ships with `nginx` already installed, check with `apt-cache show nginx` but don't use it. Install from the official NGINX repository to ensure we always use the most up to date version.

Add NGINX's package repository to list of repo's Ubuntu searches for when it tries to download a package. First create a uniquely named file in `/etc/apt/sources.list.d/` and add an entry for NGINX repo there

  ```
  jsore@foundation:hobnob:$ echo "deb http://nginx.org/packages/ubuntu/ bionic nginx" | sudo tee -a /etc/apt/sources.list.d/nginx.list

  jsore@foundation:hobnob:$ echo "deb-src http://nginx.org/packages/ubuntu/ bionic nginx" | sudo tee -a /etc/apt/sources.list.d/nginx.list
  ```

Add the public GPG key NGINX signed their package with so that `apt` knows how to check its integrity and authenticity:

  ```
  jsore@foundation:hobnob:$ sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys ABF5BD827BD9BF62
  jsore@foundation:hobnob:$ sudo apt update && sudo apt install nginx
  ```

Should be installed, but not running yet

  ```
  jsore@foundation:hobnob:$ sudo systemctl status nginx.service
  ● nginx.service - nginx - high performance web server
     Loaded: loaded (/lib/systemd/system/nginx.service; enabled; vendor preset: enabled)
     Active: inactive (dead)
       Docs: http://nginx.org/en/docs/
  ```

# Deployment

Deploying the CRUD/search API on a VM for worldwide access. Any deviations from the book's configurations vs what
I plan on doing or have decided to use will be noted, along with reasoning when appropriate.

<br><br>



--------------------------------------------------------------------------------
### VPS Deployment & Config Notes

__Books goals:__

- Expose the API to the web...
- Using DigitalOcean VPS...
- With a purchased domain...
- With proper DNS configuration.

Requirements translated: <br>

&nbsp;&nbsp; Secure a VPS with Ubuntu. Learn privileged ports. Handle state managed with __PM2__. Use NGINX as a<br>
&nbsp;&nbsp; reverse proxy to the API understand DNS architecture.

<br><br>



__I will be using a VirtualBox VM, managed locally__

And that should hopefully be able to mimic this.

&nbsp;&nbsp; I'll connect to it through a reverse tunnel for __rsub__ support

  ```
  alias ssh='ssh -R 52698:localhost:52698 admin@127.0.0.1 -p <port>'

  $ ssh
  > admin@127.0.0.1 password: ...
  ```

&nbsp;&nbsp; The VBox VM is sitting at `10.0.3.15`. Node is already installed, but may take some finangling, <br>
&nbsp;&nbsp; local is v10.15.3, VM is v8.16.0. Elasticsearch is also already installed and is apparently running

  ```
  $ curl http://localhost:9200
  $ systemctl status elasticsearch
  ```

&nbsp;&nbsp; Further, DigitalOcean provides some sort of dashboard for service management: VPS, DNS, block <br>
&nbsp;&nbsp; storage, monitoring, Kubernetes...this may be a bump in the road to solve in the future. I have a  <br>
&nbsp;&nbsp; live environment on Linode already for my site.

<br><br>



__Hostname & address__

Coincidentally the author is using the same string as his workhorse user: `hobnob @142.93.241.63`

&nbsp;&nbsp; Note about server names: Keep a sensible naming convention

  ```
  <environment>.<feature>.<function><replica>
  ```

&nbsp;&nbsp; Example: machine acting as a load balancer for auth service in the staging env

  ```
  staging.auth.lb1
  ```

&nbsp;&nbsp; Benefit: easier visual queues in the terminal:

  ```
  hobnob@staging.auth.lb1:-$
  ```

&nbsp;&nbsp; More 'annecdotes': https://www.ietf.org/rfc/rfc1178

<br><br>



__Document structure for commands__

For commands to remote:`<user>@hobnob $`. Otherwise, for local commands: `$`.

<br><br>



__Reduced priv user__

Create `hobnob` then push into sudo group: `# usermod -aG sudo hobnob`.

<br><br>



__Use PKI auth for SSH__

My machines have already been secured in this manner, but I'll still take notes. _Knowledge Is Power_.

&nbsp;&nbsp; The `ssh-agent` will be in charge of holding private keys. Each development machine should have its<br>
&nbsp;&nbsp; own key. Start with checking for existing keys:

  ```
  $ cd ~/.ssh/ && ls -ahl    # this is where keys are normally stored by default
  ```

&nbsp;&nbsp; Then build the key, using the default location for storage and using the 4,096 bit length RSA <br>
&nbsp;&nbsp; algorithm. Set the additional passphrase when prompted, we're not in a situation where the program<br>
&nbsp;&nbsp; will run inside an environment where user input isn't possible

  ```
  # Note: this is a local command, obviously you want the priv SSH key not to be shared

  $ ssh-keygen -t rsa -b 4096 -C email@address.com
  > ...
  > Your identification has been saved in $HOME/.shh/id_rsa.    # the private key
  > Your public key has been saved in $HOME/.ssh/id_rsa.pub.    # the public key
  ```

&nbsp;&nbsp; Grab the public key as a string and copy it to your clipboard

  ```
  $ cat ~/.ssh/id_rsa.pubssh-rsa.pubssh-rsa <long string of characters to copy>
  ```


testing `alt+255` or OPTION+SPACE, equal to `&nbsp;` in HTML

no spaces before me

 one normal space before me

  two normal space before me


  alt space test with two chars


 
  U+2002 then U+2003 no other space

   U+2002 then U+2003 then normal space


   test with new macro, u2002+u2003 and normal space

   ```
   this codeblock was indented with CTRL+SPACE, the macro from the previous line, u2002+2002+space
   ```

  ```
  this one is with u2003 + a space
  ```

 ```
 this one is just with u2003
 ```

 ```
 this one is just with u2002
 ```

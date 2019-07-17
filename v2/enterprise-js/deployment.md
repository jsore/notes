# Deployment

Deploying the CRUD/search API on a VM for worldwide access.

Any deviations from the book's configurations vs what I plan on doing or have
decided to use will be noted, along with reasoning when appropriate.

<br><br>



--------------------------------------------------------------------------------
### VPS Deployment, Book's Configs

__Books goals:__

- Expose the API to the web...
- Using DigitalOcean VPS...
- With a purchased domain...
- With proper DNS configuration.

&nbsp;&nbsp; Requirements translated: Secure a VPS with Ubuntu. Learn privileged ports. Handle state managed with<br>
&nbsp;&nbsp;  __PM2__. Use NGINX as a reverse proxy to the API understand DNS architecture.

<br>


__I will be using a VirtualBox VM, managed locally__

&nbsp;&nbsp; This should be able to mimic this. I'll connect to it through a reverse tunnel for __rsub__ support

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

<br>


__Hostname & address__

&nbsp;&nbsp; `hobnob @142.93.241.63`

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

<br>


__Document structure for commands__

&nbsp;&nbsp; For commands to remote:`<user>@hobnob $`
&nbsp;&nbsp; For local commands: `$`

<br>


__Reduced priv user__

&nbsp;&nbsp; Create `hobnob` -> into sudo group: `# usermod -aG sudo hobnob`.

<br>


__Use PKI auth for SSH__

&nbsp;&nbsp; The `ssh-agent` will be in charge of holding private keys.

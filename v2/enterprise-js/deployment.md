# Deployment

Deploying the CRUD/search API on a VM for worldwide access.

Any deviations from the book's configurations vs what I plan on doing or have
decided to use will be noted, along with reasoning when appropriate.

<br><br>



--------------------------------------------------------------------------------
### VPS Deployment

__Books goals:__

- Expose the API to the web

- Using DigitalOcean VPS
  + secure a VPS
  + with Ubuntu
  + learn privileged ports
  + process state managed with __PM2__
  + NGINX as a reverse proxy to the API

- With a purchased domain

- With proper DNS configuration
  + understand DNS architecture

<br>


__I will be using a VirtualBox VM, managed locally__, which should be able to mimic
everything. I'll connect to it through a reverse tunnel for __rsub__ support

  ```
  alias ssh='ssh -R 52698:localhost:52698 admin@127.0.0.1 -p <port>'

  $ ssh
  > admin@127.0.0.1 password: ...
  ```

  The VBox VM is sitting at `10.0.3.15`

  Node is already installed, but may take some finangling, local is v10.15.3, VM is
  v8.16.0. Elasticsearch is also already installed and is apparently running

  ```
  $ curl http://localhost:9200
  $ systemctl status elasticsearch
  ```

  Further, DigitalOcean provides some sort of dashboard for service management:
  VPS, DNS, block storage, monitoring, Kubernetes...this may be a bump in the road
  to solve in the future. I have a live environment on Linode already for my site.

<br>

__Running list of book's config__

Hostname & address: __hobnob @142.93.241.63__

  Keep a sensible naming convention

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

  https://www.ietf.org/rfc/rfc1178

<br>


Format: __`<user>@hobnob $`__ for commands to remote server, __`$`__ for local
commands

<br>


Reduced priv user: __`hobnob`__ -> into sudo group: `# usermod -aG sudo hobnob`

<br>


As normal, use PKI auth with `ssh-agent` to hold private keys

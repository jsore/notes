> This has been migrated to a Private repo to protect sensitive info.

# Portfolio Redeployment

I've decided to go full swing at bolstering my current public portfolio. As it stands currently, it's a hobbled together Express-based service with PM2 running under `root` and services installed that I'm not actively maintaining or paying attention to any longer, like Apache. Time to trim the weeds.

<br><br>



--------------------------------------------------------------------------------
### Replication TODO's

The goal of this whole writeup is to learn tips on how to redeploy a beefier version of my website. I've decided to move forward and begin migrating to a new server, starting from scratch, but with some changes from what the book is doing.

<br>


- [ ] __Spin up a new Linode VM,__ ~~CentOS 7.6.x~~ __Ubuntu 18__

      Book deviation: Digitial Ocean, Ubuntu 18.04

      Edit: on 2nd/3rd/4th thought, might as well just go ahead and play with Ubuntu

      Just personal preference, it's what I've been using for years now.

<br>


- [ ] __Running__ ~~CentOS 7.6.x~~ __Ubuntu 18, 2 CPU/80GB HDD/4GB RAM ( $20/mo )__

      Book deviation: ~~Ubuntu 18.04.x, 4GB RAM~~

      Elasticsearch is memory intensive, suggested RAM config of 16-64GB. That's out of scope for<br>
      my private server I'll be running, too expensive to justify for a portfolio. Will still be <br>
      an upgrade from the current server I'm running though, currently 1 CPU w/2GB RAM @ $10/mo.

<br>

- [ ] __Future proofed host naming conventions, current:__ `cent.jsore.com`

      This is a personal project, so why _not_ use my cat's name? `sushi`
<br>


- [ ] __2FA on Linode account__

<br>


- [ ] __New SSH keys,__ `sshd` __root login fail__

      NO MORE `root` RUNNING EVERYTHING THIS TIME

<br>


- [ ] __Lockdown__ `firewalld`

<br>


- [ ] __Configure__ `rsub`

<br>


- [ ] __Configure__ `bashrc`

<br>


- [ ] __GitHub integration shouldn't be needed maybe?__

<br>


- [ ] __Domain needs to be transferred off existing server, finish book's DNS sections prior to though__

      Curious to see what difference the author implemented in their DNS configs. I'm competent,<br>
      have a full working DNS config set, but haven't played with reverse proxies before, don't <br>
      know if that'll conflict.

<br>


- [ ] __Mail server migration__

      Need to make a decision here: should I keep my original $10/mo box, wipe it and hand roll an<br>
      mail solution or continue to use Fastmail and point that service at the new box? Look further<br>
      into `Mail-in-a-Box`?

      Logic dictates that since I'm advertising myself as a fullstack dev I should, but...Until that<br>
      decision has been made I'll just continue using Fastmail, specially since I'm job hunting <br>
      currently and need it available reliably.
     
<br>


- [ ] __HTTPS via NGINX reverse proxy__

      No more Apache.

<br>


- [ ] __Temporary hosting of trimmed, pure HTML/CSS splash page__

      This should be a basic Express server, located at a different path from `hobnob`, completely<br>
      separate thing with as minimal package usage as possible.

      Up until this point, development should have been fleshed out locally on a VBox VM, then moved<br>
      to a new Linode VM where the majority of the work that should be remaining is completed w/o<br>
      relying on my live domain name.

      Once this point has been reached, it should be able to be considered jsore.com v2.0.1

<br>


- [ ] __Containerization with Docker__

      This is the instantiation of jsore.com v2.1.0

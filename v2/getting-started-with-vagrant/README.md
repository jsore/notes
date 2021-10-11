# Getting Started With Vagrant

A tool that simplifies the workflow of operating VMs and allows for easy distribution of virtual environments.


<br>


## Chapter 1 - Getting Started 

No matter what virtualization platform you use or how complicated your virtual environment may be, Vagrant boots your VM or VMs with:

`$ vagrant up`

This command is the most fundamental feature of Vagrant. 

Without it, you'd have to find a way to distribute your bare VM image ( basically just an OS for someone to install on their virt platform ), start the VM, configure the VM's shared directories and NIC's then install any dependencies or software required to match what the distributor is using. 

Depending on your config file, there's tons of commands that can be ran with `vagrant up` including installing any software or dependencies after the VM is booted/established. 

<br>

### Focusing On WebDev 

Vagrant is useful for many situations, however, it's predominately ( apparently? ) used within web app development. 

---
title: "GPU Configuration Guide for Proxmox LXCs"
date: "2025-02-04"
excerpt: "A comprehensive guide to configuring NVIDIA GPUs for Proxmox LXC containers, optimized for vLLM and AI workloads."
author: "Ediz Tefenlilioglu"
---

This guide provides a step-by-step walkthrough for configuring NVIDIA GPUs within Proxmox LXC containers. This setup is specifically optimized for running high-performance AI workloads like vLLM.

> **⚠️ Important**: This guide is based on a specific hardware configuration. Your device IDs and setup requirements may vary depending on your hardware!

## Hardware Reference Configuration

- **CPU**: AMD Epyc 7313P Server Processor
- **GPUs**: 2× NVIDIA RTX 3090 Ti
- **OS**: Proxmox VE 8.3.3

## Prerequisites

- Proxmox VE installed and updated
- NVIDIA GPUs physically installed and detected
- Root access to Proxmox host
- Basic understanding of command line operations

## Proxmox Host Configuration

### Install Required Packages

```bash
apt update && apt upgrade -y
apt install pve-headers build-essential software-properties-common make nvtop htop -y
```

### Install NVIDIA Drivers

```bash
# Create directory and download driver
mkdir -p ~/NVIDIA && cd ~/NVIDIA
wget https://us.download.nvidia.com/XFree86/Linux-x86_64/550.144.03/NVIDIA-Linux-x86_64-550.144.03.run
chmod +x NVIDIA-Linux-x86_64-550.144.03.run

# Install driver with DKMS support
./NVIDIA-Linux-x86_64-550.144.03.run --dkms
```

> **Installation Prompts**:
> 1. Select "OK" when prompted
> 2. Accept building headers
> 3. Select "No" for X Server Configuration
> 4. **❗ Reboot system after installation**

### Verify Installation and Identify Device IDs

```bash
# Check GPU functionality
nvtop

# List NVIDIA devices and their IDs
ls -al /dev/nvidia*
```

Expected output (IDs may differ on your system):

```bash
crw-rw-rw- 1 root root 195,   0 Feb  4 14:43 /dev/nvidia0
crw-rw-rw- 1 root root 195,   1 Feb  4 14:43 /dev/nvidia1
crw-rw-rw- 1 root root 195, 255 Feb  4 14:43 /dev/nvidiactl
crw-rw-rw- 1 root root 511,   0 Feb  4 14:43 /dev/nvidia-uvm
crw-rw-rw- 1 root root 511,   1 Feb  4 14:43 /dev/nvidia-uvm-tools

/dev/nvidia-caps:
total 0
drwxr-xr-x  2 root root     80 Feb  4 14:43 .
drwxr-xr-x 18 root root   4780 Feb  4 14:43 ..
cr--------  1 root root 236, 1 Feb  4 14:43 nvidia-cap1
cr--r--r--  1 root root 236, 2 Feb  4 14:43 nvidia-cap2
```

> **❗ Important**: Note down your specific device IDs. In this example, they are **195**, **511**, and **236**.

## LXC Container Configuration

### Add GPU Access to Container

Add these lines to your container's configuration file (`/etc/pve/lxc/[CONTAINER-ID].conf`):

```bash
# Replace these IDs with your actual device IDs if different!
lxc.cgroup2.devices.allow: c 195:* rwm
lxc.cgroup2.devices.allow: c 236:* rwm
lxc.cgroup2.devices.allow: c 511:* rwm

# Device mounts for dual GPU setup
lxc.mount.entry: /dev/nvidia0 dev/nvidia0 none bind,optional,create=file
lxc.mount.entry: /dev/nvidia1 dev/nvidia1 none bind,optional,create=file
lxc.mount.entry: /dev/nvidiactl dev/nvidiactl none bind,optional,create=file
lxc.mount.entry: /dev/nvidia-modeset dev/nvidia-modeset none bind,optional,create=file
lxc.mount.entry: /dev/nvidia-uvm dev/nvidia-uvm none bind,optional,create=file
lxc.mount.entry: /dev/nvidia-uvm-tools dev/nvidia-uvm-tools none bind,optional,create=file
lxc.mount.entry: /dev/nvidia-caps/nvidia-cap1 dev/nvidia-caps/nvidia-cap1 none bind,optional,create=file
lxc.mount.entry: /dev/nvidia-caps/nvidia-cap2 dev/nvidia-caps/nvidia-cap2 none bind,optional,create=file
```

## Container Setup

### Install NVIDIA Driver in Container

```bash
# FROM HOST: Copy driver to container (replace $CONTAINER_ID with your CT ID)
pct push $CONTAINER_ID NVIDIA-Linux-x86_64-550.144.03.run /root/
pct enter $CONTAINER_ID

# INSIDE CONTAINER: Install driver
./NVIDIA-Linux-x86_64-550.144.03.run --no-kernel-modules
```

### Install NVIDIA Container Toolkit

```bash
# Add NVIDIA repository and GPG key
apt install gpg curl
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | \
    gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg
curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \
    sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
    tee /etc/apt/sources.list.d/nvidia-container-toolkit.list

# Install packages
apt update
apt install nvidia-container-toolkit nvtop
```

### Configure NVIDIA Container Runtime

```bash
# Edit configuration file
nano /etc/nvidia-container-runtime/config.toml

# Add/modify this line:
no-cgroups = true
```

## vLLM Installation

### Install UV Package Manager

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### Set Up Python Environment

```bash
# Create virtual environment
uv venv vllm --python 3.12 --seed

# Activate environment
source vllm/bin/activate

# Install vLLM and dependencies
uv pip install vllm
apt-get update && apt-get install build-essential
```

### Run Model (Optimized for 2× RTX 3090 Ti)

```bash
vllm serve casperhansen/llama-3.3-70b-instruct-awq \
    --tensor-parallel-size 2 \
    --max-model-len 8192 \
    --gpu-memory-utilization 0.98 \
    --port 80 \
    --api-key YOUR_SECURE_API_KEY_HERE
```

## Adding Systemd Service for vLLM Model

### Create Service Directory and Script

```bash
# Create directory for script
mkdir -p /opt/vllm/scripts

# Create the startup script
nano /opt/vllm/scripts/start-vllm.sh
```

Add this content to `start-vllm.sh`:

```bash
#!/bin/bash
source /root/vllm/bin/activate
export CUDA_VISIBLE_DEVICES="0,1"
exec vllm serve casperhansen/llama-3.3-70b-instruct-awq \
    --tensor-parallel-size 2 \
    --max-model-len 15360 \
    --gpu-memory-utilization 0.98 \
    --port 80 \
    --api-key YOUR_SECURE_API_KEY_HERE
```

Make the script executable: `chmod +x /opt/vllm/scripts/start-vllm.sh`

### Create Systemd Service

Create `/etc/systemd/system/vllm.service`:

```ini
[Unit]
Description=vLLM AI Model Service
After=network.target nvidia-persistenced.service

[Service]
Type=simple
User=root
Group=root
WorkingDirectory=/opt/vllm
ExecStart=/opt/vllm/scripts/start-vllm.sh
Restart=always
RestartSec=30
StandardOutput=append:/var/log/vllm.log
StandardError=append:/var/log/vllm.error.log
LimitNOFILE=1000000
TimeoutStartSec=300

[Install]
WantedBy=multi-user.target
```

### Enable and Start

```bash
systemctl daemon-reload
systemctl enable vllm
systemctl start vllm
```

## Troubleshooting

If the service fails to start, check the logs:
`journalctl -u vllm -n 100 --no-pager`

Verify GPU availability:
`nvidia-smi`

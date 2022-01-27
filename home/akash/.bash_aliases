# Command to open file or folder using the default application
alias xopen=xdg-open
alias diff="diff --color=always"
alias less="less -R"
alias poweroff="loginctl poweroff"
alias reboot="loginctl reboot"
alias termux_mount="sshfs -p 8022 u0_a212@192.168.43.1:/storage/emulated/0"
alias termux_mount_iit="sshfs -p 8022 u0_a212@10.8.18.144:/storage/emulated/0"
alias redmi6_mount="sshfs -p 8022 u0_a302@192.168.43.253:/storage/emulated/0"
alias lat="ls -lat --color=always | head"
alias conda_init="source $HOME/miniconda3/conda_init"
alias cling_load="source $HOME/miniconda3/conda_init && conda activate cling"
alias cvim="nvim -c ':LoadCompe'"
alias start_server="python -m http.server 9990"
function lt {
  ls -t --color=always $@ | head
}
function rgf {
  rg -L --hidden --files ${@:2} | rg $1
}

# Python venv aliases
alias venv_audio="source $HOME/pyvenv/audio/bin/activate"
alias venv_gentle="source $HOME/pyvenv/gentle/bin/activate"
alias venv_manim="source $HOME/pyvenv/manim/bin/activate"
alias venv_manimce="source $HOME/pyvenv/manimce/bin/activate"
alias venv_playground="source $HOME/pyvenv/playground/bin/activate"
alias venv_whoogle="source $HOME/pyvenv/whoogle/bin/activate"
alias venv_spark="source $HOME/pyvenv/spark/bin/activate"
alias venv_cling="source $HOME/pyvenv/cling/bin/activate"
alias venv_shit="source $HOME/pyvenv/shit/bin/activate"
alias venv_aeneas="source $HOME/pyvenv/aeneas/bin/activate"
alias venv_animate="source $HOME/pyvenv/animate/bin/activate"
alias venv_flask="source $HOME/pyvenv/flask/bin/activate"

function XPROP {
  xprop | awk '/^WM_CLASS/{sub(/.* =/, "instance:"); sub(/,/, "\nclass:"); print} /^WM_NAME/{sub(/.* =/, "title:"); print}'
}

export CREDS="/mnt/SSD_D/Akash/credentials"

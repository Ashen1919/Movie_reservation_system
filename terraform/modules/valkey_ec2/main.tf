# ami for ec2 instance
data "aws_ami" "valkey_ami" {
  most_recent = true
  owners     = ["amazon"] # Amazon-owned AMIs
  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"] # Amazon Linux 2023 AMI pattern
  }
  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# ec2 instance for valkey
resource "aws_instance" "valkey_instance" {
    ami                    = data.aws_ami.valkey_ami.id
    instance_type          = var.instance_type
    subnet_id              = var.private_subnet_id
    vpc_security_group_ids = [aws_security_group.valkey_sg.id]

    disable_api_termination = var.environment == "production" ? true : false

    # root volume configuration
    root_block_device {
        volume_size = 8
        volume_type = "gp3"
        encrypted   = true
        delete_on_termination = true
    }

    # user data to install and configure Valkey
    user_data = base64encode(templatefile("${path.module}/user_data.sh", {
        valkey_password = var.valkey_password
        valkey_port     = 6379
        environment     = var.environment
    }))
    
    tags = {
        Name        = "${var.project_name}-${var.environment}-valkey"
    }
}
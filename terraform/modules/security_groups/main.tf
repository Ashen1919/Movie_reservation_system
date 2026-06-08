# security group for ALB
resource "aws_security_group" "alb_sg" {
    name        = "${var.project_name}-${var.environment}-alb-sg"
    description = "Security group for ALB"
    vpc_id      = var.vpc_id

    ingress {
        description = "Allow HTTP traffic from anywhere"
        from_port   = 80
        to_port     = 80
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    ingress {
        description = "Allow HTTPS traffic from anywhere"
        from_port   = 443
        to_port     = 443
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    egress {
        description = "Allow all outbound traffic"
        from_port   = 0
        to_port     = 0
        protocol    = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }

    tags = { Name = "${var.project_name}-${var.environment}-alb-sg"}
}

# security group for ECS 
resource "aws_security_group" "ecs_sg" {
    name        = "${var.project_name}-${var.environment}-ecs-sg"
    description = "Security group for ECS"
    vpc_id      = var.vpc_id

    ingress {
        description = "Allow traffic from ALB security group"
        from_port   = 3000
        to_port     = 3000
        protocol    = "tcp"
        security_groups = [aws_security_group.alb_sg.id]
    }

    egress {
        description = "Allow all outbound traffic"
        from_port   = 0
        to_port     = 0
        protocol    = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }

    tags = { Name = "${var.project_name}-${var.environment}-ecs-sg"}
}

# security group for valkey ec2
resource "aws_security_group" "valkey_ec2_sg" {
    name        = "${var.project_name}-${var.environment}-valkey-ec2-sg"
    description = "Security group for Valkey EC2 instances"
    vpc_id      = var.vpc_id

    ingress {
        description = "Allow SSH traffic from anywhere"
        from_port   = 22
        to_port     = 22
        protocol    = "tcp"
        cidr_blocks = [var.admin_ip_cidr]
    }

    ingress {
        description = "Allow traffic from ECS security group"
        from_port   = 6379
        to_port     = 6379
        protocol    = "tcp"
        security_groups = [aws_security_group.ecs_sg.id]
    }

    egress {
        description = "Allow all outbound traffic"
        from_port   = 0
        to_port     = 0
        protocol    = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }

    tags = { Name = "${var.project_name}-${var.environment}-valkey-ec2-sg"}
}
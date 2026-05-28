# define alb
resource "aws_lb" "main_lb" {
  name               = "${var.project_name}-${var.environment}-main-lb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.alb_sg_id]
  subnets            = var.public_subnet_ids
  enable_deletion_protection = var.environment == "production" ? true : false

  tags = {
    Name: "${var.project_name}-${var.environment}-main-lb"
  }
}

# define target group
resource "aws_lb_target_group" "api_tg" {
    name     = "${var.project_name}-${var.environment}-api-tg"
    port     = 3000
    protocol = "HTTP"
    vpc_id   = var.vpc_id
    target_type = "ip"
    
    health_check {
        enabled             = true
        path                = "api/health"
        port                = "traffic-port"
        protocol            = "HTTP"
        interval            = 30
        timeout             = 5
        healthy_threshold   = 3
        unhealthy_threshold = 3
        matcher             = "200"
    }
    
    tags = {
        Name: "${var.project_name}-${var.environment}-api-tg"
    }
}

# define HTTP listener
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main_lb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

# define HTTPS listener
resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.main_lb.arn
  port              = 443
  protocol          = "HTTPS"

  default_action {
    target_group_arn = aws_lb_target_group.api_tg.arn
    type             = "forward"
  }
}
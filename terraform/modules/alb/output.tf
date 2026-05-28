output "alb_arn" {
  value = aws_lb.main_lb.arn
}

output "alb_dns_name" {
  value = aws_lb.main_lb.dns_name
}

output "alb_target_group_arn" {
  value = aws_lb_target_group.api_tg.arn
}

output "alb_zone_id" {
  value = aws_lb.main_lb.zone_id
}

output "alb_https_listener_arn" {
  value = aws_lb_listener.https.arn
}
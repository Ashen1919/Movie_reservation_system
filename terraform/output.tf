# vpc ID output
output "vpc_id" {
  description = "VPC ID"
  value       = module.vpc.vpc_id
}

# ECR repository URL output
output "ecr_repository_url" {
  description = "ECR Repository URL"
  value       = module.ecr.ecr_repo_url
}

# Elasticache endpoint output
output "elasticache_endpoint" {
  description = "Elasticache Endpoint"
  value = module.elasticache.primary_endpoint
  sensitive = true
}
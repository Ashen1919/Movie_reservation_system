# module vpc
module "vpc" {
  source       = "./modules/vpc"
  project_name = var.project_name
  environment  = var.environment
}

# module ecr
module "ecr" {
  source       = "./modules/ecr"
  project_name = var.project_name
  environment  = var.environment
}

# module security groups
module "security_groups" {
  source       = "./modules/security_groups"
  project_name = var.project_name
  environment  = var.environment
  vpc_id       = module.vpc.vpc_id
}

# module for elasticache
module "elasticache" {
  source = "./modules/elasti_cache"
  project_name = var.project_name
  environment  = var.environment
  private_subnet_ids = module.vpc.private_subnet_ids
  elasticache_sg_id = module.security_groups.elasticache_sg_id
  node_type = var.redis_node_type
  redis_auth_token = var.redis_auth_token
}
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
  admin_ip_cidr = var.admin_ip_cidr
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

# module for alb
module "alb" {
  source = "./modules/alb"
  project_name = var.project_name
  environment  = var.environment
  vpc_id = module.vpc.vpc_id
  public_subnet_ids = module.vpc.public_subnet_ids
  alb_sg_id = module.security_groups.alb_sg_id
}

# module for valkey
module "valkey_ec2" {
  source = "./modules/valkey_ec2"

  project_name      = var.project_name
  environment       = var.environment
  vpc_id            = module.vpc.vpc_id                           
  private_subnet_id = module.vpc.private_subnet_ids[0]           
  ecs_sg_id         = module.security_groups.ecs_sg_id        
  admin_ip_cidr     = var.admin_ip_cidr
  instance_type     = var.valkey_instance_type
  valkey_password   = var.valkey_password
}
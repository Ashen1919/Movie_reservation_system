# module vpc
module "vpc" {
  source       = "./modules/vpc"
  project_name = var.project_name
  environment  = var.environment
}

# module ecr
module "ecr" {
  source = "./modules/ecr"
  project_name = var.project_name
  environment  = var.environment
}
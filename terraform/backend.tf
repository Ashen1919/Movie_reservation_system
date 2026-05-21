terraform {
  backend "s3" {
    bucket       = "terra-state-store-615857073848-us-east-1-an"
    key          = "global/terraform.tfstate"
    region       = "us-east-1"
    use_lockfile = true
    encrypt      = true
  }
}
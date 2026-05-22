# define ecr repository
resource "aws_ecr_repository" "movie_api" {
  name = "${var.project_name}-api"
  image_tag_mutability = "IMMUTABLE"
  image_scanning_configuration {
    scan_on_push = true
  }
  tags = {
    Name = "${var.project_name}-api"
  }
}

# define respository lifecycle policy
resource "aws_ecr_lifecycle_policy" "movie_api" {
    repository = aws_ecr_repository.movie_api.name
    policy = jsonencode({
        rules = [{
            rulePriority = 1,
            description = "Keeps latest 10 images",
            selection = {
                tagStatus = "any",
                countType = "imageCountMoreThan",
                countNumber = 10
            },
            action = {
                type = "expire"
            }
        }]
    })
}
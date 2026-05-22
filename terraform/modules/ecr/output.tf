output "ecr_repo_url" {
  description = "URL of the ECR repository"
  value = aws_ecr_repository.movie_api.repository_url
}

output "ecr_repo_arn" {
  description = "ARN of the ECR repository"
  value = aws_ecr_repository.movie_api.arn
}
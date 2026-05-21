# define the VPC resource
resource "aws_vpc" "main_vpc" {
  cidr_block = var.cidr_block
  enable_dns_hostnames = true
  enable_dns_support = true

  tags = {
    Name = "${var.project_name}-${var.environment}-vpc"
  }
}

# define the public subnet resource
resource "aws_subnet" "public_subnet" {
  count = length(var.availability_zones)
  vpc_id = aws_vpc.main_vpc.id
  cidr_block = var.public_cidr_blocks[count.index]
  availability_zone = var.availability_zones[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.project_name}-${var.environment}-public-${count.index + 1}"
  }
}

# define the private subnet resource
resource "aws_subnet" "private_subnet" {
    count = length(var.availability_zones)
    vpc_id = aws_vpc.main_vpc.id
    cidr_block = var.private_cidr_blocks[count.index]
    availability_zone = var.availability_zones[count.index]
    
    tags = {
        Name = "${var.project_name}-${var.environment}-private-${count.index + 1}"
    }
}

# define internet gateway resource
resource "aws_internet_gateway" "main_igw" {
  vpc_id = aws_vpc.main_vpc.id

  tags = {
    Name = "${var.project_name}-${var.environment}-igw"
  } 
}

# define elastic IP for NAT gateway
resource "aws_eip" "main_eip" {
  domain = "vpc"

  tags = {
      Name = "${var.project_name}-${var.environment}-nat-eip"
  }
}

# define NAT gateway resource
resource "aws_nat_gateway" "main_nat_gw" {
  allocation_id = aws_eip.main_eip.id
  subnet_id = aws_subnet.public_subnet[0].id

  tags = {
      Name = "${var.project_name}-${var.environment}-nat-gw"
  } 
}

# define route table for public subnets
resource "aws_route_table" "public_rt" {
    vpc_id = aws_vpc.main_vpc.id

    route {
        cidr_block = "0.0.0.0/0"
        gateway_id = aws_internet_gateway.main_igw.id
    }
    
    tags = {
        Name = "${var.project_name}-${var.environment}-public-rt"
    }
}

# define route table for private subnets
resource "aws_route_table" "private_rt" {
    vpc_id = aws_vpc.main_vpc.id
    
    route {
        cidr_block = "0.0.0.0/0"
        gateway_id = aws_nat_gateway.main_nat_gw.id
    }

    tags = {
        Name = "${var.project_name}-${var.environment}-private-rt"
    }
}

# associate public subnets with public route table
resource "aws_route_table_association" "public_subnet_association" {
  count = length(aws_subnet.public_subnet)
  subnet_id = aws_subnet.public_subnet[count.index].id
  route_table_id = aws_route_table.public_rt.id
}

# associate private subnets with private route table
resource "aws_route_table_association" "private_subnet_association" {
  count = length(aws_subnet.private_subnet)
  subnet_id = aws_subnet.private_subnet[count.index].id
  route_table_id = aws_route_table.private_rt.id
}
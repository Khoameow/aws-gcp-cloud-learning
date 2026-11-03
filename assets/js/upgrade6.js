/* ============================================================
   upgrade6.js — ĐỢT 4 · VIỆC 2:
   Trang mới "Luyện viết Terraform & Kubernetes" (route #/iac,
   link trong trụ navbar "Thực hành & Triển khai"):
   24 bài viết code (11 Terraform HCL + 13 Kubernetes YAML),
   3 cấp độ. Mỗi bài: nhiệm vụ VI + JP, khung soạn thảo mono tối
   màu, nút Kiểm tra chấm theo các yếu tố bắt buộc (regex linh
   hoạt, không bắt khớp từng ký tự) và phản hồi từng điểm
   đạt/thiếu, nút Xem lời giải mẫu (code hoàn chỉnh + giải thích),
   nút điền lời giải vào khung. Tiến độ "đã đạt x/24" lưu
   localStorage (khoameow_iac_v1) như các phần khác.
   Nạp SAU upgrade5.js.
   ============================================================ */
(function(){
"use strict";
function $(id){ return document.getElementById(id); }
function E(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;'); }
function L(vi,jaT){ return (window.LANG==='ja'&&jaT)?jaT:vi; }
var LVN=['Cơ bản','Trung cấp','Nâng cao'], LVJ=['基礎','中級','上級'];

/* ================= DỮ LIỆU BÀI TẬP ================= */
/* checks: [nhãn VI, nhãn JP, RegExp] — chấm linh hoạt theo yếu tố bắt buộc */
var IAC=[
/* ---------- TERRAFORM ---------- */
{id:'tf1',tr:'tf',lv:0,
 t:'Cấu hình provider AWS',
 q:'Khai báo block terraform yêu cầu provider hashicorp/aws (bản ~> 5.0), rồi cấu hình provider "aws" với region là Tokyo: ap-northeast-1.',
 qj:'terraform ブロックで hashicorp/aws プロバイダ（~> 5.0）を要求し、provider "aws" の region に東京（ap-northeast-1）を設定してください。',
 start:'# tf1 — provider AWS\n',
 checks:[
  ['Có block provider "aws"','provider "aws" ブロックがある',/provider\s+"aws"\s*\{/],
  ['region = "ap-northeast-1" (Tokyo)','region = "ap-northeast-1"（東京）',/region\s*=\s*"ap-northeast-1"/],
  ['Khai báo source hashicorp/aws trong required_providers','required_providers に hashicorp/aws の source',/required_providers\s*\{[\s\S]*?hashicorp\/aws/]
 ],
 sol:'terraform {\n  required_providers {\n    aws = {\n      source  = "hashicorp/aws"\n      version = "~> 5.0"\n    }\n  }\n}\n\nprovider "aws" {\n  region = "ap-northeast-1"\n}',
 exp:'Mọi file Terraform đều bắt đầu bằng hai việc: khai báo provider (plugin nói chuyện với cloud) và region mặc định. Ghim version bằng ~> để tránh provider tự nhảy bản lớn gây vỡ cấu hình.',
 expj:'全ての Terraform はプロバイダ（クラウドと話すプラグイン）とデフォルトリージョンの宣言から始まります。~> でバージョンを固定し、想定外のメジャー更新を防ぎます。'},
{id:'tf2',tr:'tf',lv:0,
 t:'S3 bucket + bật versioning',
 q:'Tạo một resource aws_s3_bucket tên bất kỳ, rồi tạo resource aws_s3_bucket_versioning gắn vào đúng bucket đó với status = "Enabled".',
 qj:'aws_s3_bucket リソースを作成し、そのバケットに対する aws_s3_bucket_versioning で status = "Enabled" を設定してください。',
 start:'# tf2 — S3 bucket + versioning\n',
 checks:[
  ['Có resource "aws_s3_bucket"','resource "aws_s3_bucket" がある',/resource\s+"aws_s3_bucket"\s+"/],
  ['Có resource "aws_s3_bucket_versioning"','resource "aws_s3_bucket_versioning" がある',/resource\s+"aws_s3_bucket_versioning"\s+"/],
  ['Versioning gắn đúng bucket (bucket = aws_s3_bucket.<tên>.id)','bucket = aws_s3_bucket.<名前>.id で正しく参照',/bucket\s*=\s*aws_s3_bucket\.[\w-]+\.id/],
  ['status = "Enabled" trong versioning_configuration','versioning_configuration の status = "Enabled"',/versioning_configuration\s*\{[\s\S]*?status\s*=\s*"Enabled"/]
 ],
 sol:'resource "aws_s3_bucket" "data" {\n  bucket = "my-learning-data-2026"\n\n  tags = {\n    Project = "learning"\n    Env     = "dev"\n  }\n}\n\nresource "aws_s3_bucket_versioning" "data" {\n  bucket = aws_s3_bucket.data.id\n\n  versioning_configuration {\n    status = "Enabled"\n  }\n}',
 exp:'Từ provider AWS v4, versioning tách thành resource riêng aws_s3_bucket_versioning và tham chiếu bucket qua aws_s3_bucket.data.id — viết liền trong resource bucket như bản cũ sẽ bị báo lỗi/thiếu.',
 expj:'AWS プロバイダ v4 以降、バージョニングは専用リソース aws_s3_bucket_versioning に分離され、aws_s3_bucket.data.id で参照します。'},
{id:'tf3',tr:'tf',lv:0,
 t:'Variables & Outputs',
 q:'Khai báo variable "region" có default là "ap-northeast-1", và một output "region_name" lấy giá trị từ var.region.',
 qj:'variable "region"（default は "ap-northeast-1"）と、var.region を参照する output "region_name" を書いてください。',
 start:'# tf3 — variables & outputs\n',
 checks:[
  ['Có variable "region"','variable "region" がある',/variable\s+"region"\s*\{/],
  ['default = "ap-northeast-1"','default = "ap-northeast-1"',/default\s*=\s*"ap-northeast-1"/],
  ['Có output "region_name"','output "region_name" がある',/output\s+"region_name"\s*\{/],
  ['output lấy value = var.region','value = var.region',/value\s*=\s*var\.region/]
 ],
 sol:'variable "region" {\n  type        = string\n  default     = "ap-northeast-1"\n  description = "Region mac dinh (Tokyo)"\n}\n\noutput "region_name" {\n  value = var.region\n}',
 exp:'variable là “tham số đầu vào” của cấu hình (đổi môi trường không cần sửa code), output là “kết quả trả ra” sau apply để module khác hoặc người vận hành đọc. Quy ước: luôn có type và description.',
 expj:'variable は構成の入力パラメータ、output は apply 後に外へ渡す値です。type と description を必ず付けるのが慣習です。'},
{id:'tf4',tr:'tf',lv:1,
 t:'VPC + subnet ở Tokyo',
 q:'Tạo aws_vpc với cidr_block "10.0.0.0/16", và một aws_subnet thuộc VPC đó (vpc_id tham chiếu aws_vpc) nằm ở availability_zone ap-northeast-1a.',
 qj:'cidr_block "10.0.0.0/16" の aws_vpc と、その VPC を参照する aws_subnet（availability_zone は ap-northeast-1a）を作成してください。',
 start:'# tf4 — VPC + subnet\n',
 checks:[
  ['Có resource "aws_vpc"','resource "aws_vpc" がある',/resource\s+"aws_vpc"\s+"/],
  ['cidr_block = "10.0.0.0/16"','cidr_block = "10.0.0.0/16"',/cidr_block\s*=\s*"10\.0\.0\.0\/16"/],
  ['Có resource "aws_subnet"','resource "aws_subnet" がある',/resource\s+"aws_subnet"\s+"/],
  ['subnet gắn VPC: vpc_id = aws_vpc.<tên>.id','vpc_id = aws_vpc.<名前>.id',/vpc_id\s*=\s*aws_vpc\.[\w-]+\.id/],
  ['availability_zone ở Tokyo (ap-northeast-1a hoặc 1c)','availability_zone が東京（1a または 1c）',/availability_zone\s*=\s*"ap-northeast-1[ac]"/]
 ],
 sol:'resource "aws_vpc" "main" {\n  cidr_block           = "10.0.0.0/16"\n  enable_dns_hostnames = true\n\n  tags = { Name = "prod-vpc" }\n}\n\nresource "aws_subnet" "public_a" {\n  vpc_id            = aws_vpc.main.id\n  cidr_block        = "10.0.1.0/24"\n  availability_zone = "ap-northeast-1a"\n\n  tags = { Name = "public-1a" }\n}',
 exp:'Subnet không tự biết mình thuộc VPC nào — phải nối bằng vpc_id = aws_vpc.main.id. Cách tham chiếu này cũng tạo thứ tự phụ thuộc ngầm: Terraform sẽ tạo VPC trước, subnet sau.',
 expj:'サブネットは vpc_id = aws_vpc.main.id で VPC に紐付けます。この参照が暗黙の依存関係となり、作成順序も自動で決まります。'},
{id:'tf5',tr:'tf',lv:1,
 t:'EC2 instance trong subnet',
 q:'Tạo aws_instance có ami, instance_type dòng t3 (vd t3.micro), đặt vào một subnet qua subnet_id, và gắn tags có Name.',
 qj:'aws_instance を作成：ami、instance_type（t3 系、例 t3.micro）、subnet_id、Name タグを含めてください。',
 start:'# tf5 — EC2 instance\n',
 checks:[
  ['Có resource "aws_instance"','resource "aws_instance" がある',/resource\s+"aws_instance"\s+"/],
  ['Có ami = "..."','ami が指定されている',/ami\s*=\s*"/],
  ['instance_type dòng t3','instance_type が t3 系',/instance_type\s*=\s*"t3\.[\w]+"/],
  ['Đặt vào subnet: subnet_id = ...','subnet_id が指定されている',/subnet_id\s*=\s*(aws_subnet\.|var\.|data\.)/],
  ['tags có khoá Name','tags に Name キーがある',/tags\s*=\s*\{[\s\S]*?Name\s*=/]
 ],
 sol:'resource "aws_instance" "app" {\n  ami                    = "ami-0abcdef1234567890" # Amazon Linux 2023 (Tokyo)\n  instance_type          = "t3.micro"\n  subnet_id              = aws_subnet.private_a.id\n  vpc_security_group_ids = [aws_security_group.app.id]\n  iam_instance_profile   = aws_iam_instance_profile.app.name\n\n  tags = {\n    Name    = "app-server"\n    Project = "learning"\n  }\n}',
 exp:'Ba trường không thể thiếu của một EC2: ami (ảnh máy), instance_type (cấu hình) và subnet_id (đặt máy vào mạng nào). Production nên kèm security group và IAM instance profile thay vì access key tĩnh.',
 expj:'EC2 の必須3点は ami、instance_type、subnet_id です。本番ではセキュリティグループと IAM インスタンスプロファイルも併せて設定します。'},
{id:'tf6',tr:'tf',lv:1,
 t:'IAM Role cho EC2 + policy đọc S3',
 q:'Tạo aws_iam_role có assume_role_policy cho phép service ec2.amazonaws.com gọi sts:AssumeRole, và một policy (aws_iam_role_policy hoặc policy/attachment) cho quyền s3:GetObject.',
 qj:'ec2.amazonaws.com が sts:AssumeRole できる assume_role_policy を持つ aws_iam_role と、s3:GetObject を許可するポリシー（aws_iam_role_policy 等）を作成してください。',
 start:'# tf6 — IAM role cho EC2\n',
 checks:[
  ['Có resource "aws_iam_role"','resource "aws_iam_role" がある',/resource\s+"aws_iam_role"\s+"/],
  ['assume_role_policy nhắc tới ec2.amazonaws.com','assume_role_policy に ec2.amazonaws.com',/ec2\.amazonaws\.com/],
  ['Có hành động sts:AssumeRole','sts:AssumeRole アクションがある',/sts:AssumeRole/],
  ['Có policy gắn cho role (role_policy / policy / attachment)','ロール用ポリシー（role_policy / policy / attachment）がある',/resource\s+"aws_iam_(role_policy|policy|role_policy_attachment)"/],
  ['Policy chứa quyền s3:GetObject','ポリシーに s3:GetObject',/s3:GetObject/]
 ],
 sol:'resource "aws_iam_role" "app" {\n  name = "app-ec2-role"\n\n  assume_role_policy = jsonencode({\n    Version = "2012-10-17"\n    Statement = [{\n      Effect    = "Allow"\n      Action    = "sts:AssumeRole"\n      Principal = { Service = "ec2.amazonaws.com" }\n    }]\n  })\n}\n\nresource "aws_iam_role_policy" "read_bucket" {\n  name = "read-data-bucket"\n  role = aws_iam_role.app.id\n\n  policy = jsonencode({\n    Version = "2012-10-17"\n    Statement = [{\n      Effect   = "Allow"\n      Action   = ["s3:GetObject", "s3:ListBucket"]\n      Resource = ["arn:aws:s3:::my-data-bucket", "arn:aws:s3:::my-data-bucket/*"]\n    }]\n  })\n}\n\nresource "aws_iam_instance_profile" "app" {\n  name = "app-ec2-profile"\n  role = aws_iam_role.app.name\n}',
 exp:'Role gồm 2 nửa: trust policy (ai được “đội” role này — ở đây là EC2 qua AssumeRole) và permission policy (đội rồi được làm gì — chỉ đọc đúng 1 bucket, đúng tinh thần least-privilege). EC2 dùng role qua instance profile.',
 expj:'ロールは信頼ポリシー（誰が引き受けるか）と権限ポリシー（何ができるか）の2つで構成されます。EC2 はインスタンスプロファイル経由でロールを使います。'},
{id:'tf7',tr:'tf',lv:1,
 t:'Google Cloud Storage bucket (Terraform phía GCP)',
 q:'Cấu hình provider "google", tạo google_storage_bucket ở location asia-northeast1 và bật versioning (enabled = true) trong block versioning.',
 qj:'provider "google" を設定し、location が asia-northeast1 で versioning（enabled = true）を有効にした google_storage_bucket を作成してください。',
 start:'# tf7 — Cloud Storage bucket\n',
 checks:[
  ['Có provider "google"','provider "google" がある',/provider\s+"google"\s*\{/],
  ['Có resource "google_storage_bucket"','resource "google_storage_bucket" がある',/resource\s+"google_storage_bucket"\s+"/],
  ['location = "asia-northeast1"','location = "asia-northeast1"',/location\s*=\s*"asia-northeast1"/i],
  ['versioning { enabled = true }','versioning { enabled = true }',/versioning\s*\{[\s\S]*?enabled\s*=\s*true/]
 ],
 sol:'provider "google" {\n  project = var.project_id\n  region  = "asia-northeast1"\n}\n\nresource "google_storage_bucket" "data" {\n  name                        = "my-learning-data-2026"\n  location                    = "asia-northeast1"\n  uniform_bucket_level_access = true\n\n  versioning {\n    enabled = true\n  }\n}',
 exp:'Cùng là Terraform nhưng resource phía Google dùng tiền tố google_ và khái niệm location thay cho region của AWS. uniform_bucket_level_access = true để quản quyền thống nhất bằng IAM, tắt ACL kiểu cũ.',
 expj:'同じ Terraform でも Google 側は google_ 接頭辞と location の概念を使います。uniform_bucket_level_access = true で権限を IAM に一元化します。'},
{id:'tf8',tr:'tf',lv:2,
 t:'Remote state: S3 backend + DynamoDB lock',
 q:'Trong block terraform, khai báo backend "s3" gồm bucket, key, region, dynamodb_table (bảng khoá state) và encrypt = true.',
 qj:'terraform ブロック内に backend "s3" を書き、bucket、key、region、dynamodb_table（状態ロック用）、encrypt = true を含めてください。',
 start:'# tf8 — remote state AWS\n',
 checks:[
  ['Có backend "s3"','backend "s3" がある',/backend\s+"s3"\s*\{/],
  ['Có bucket = "..."','bucket が指定されている',/bucket\s*=\s*"/],
  ['Có key = "..." (đường dẫn state)','key（state のパス）がある',/key\s*=\s*"/],
  ['Có dynamodb_table = "..." (khoá state)','dynamodb_table（ロック用）がある',/dynamodb_table\s*=\s*"/],
  ['encrypt = true','encrypt = true',/encrypt\s*=\s*true/]
 ],
 sol:'terraform {\n  backend "s3" {\n    bucket         = "company-tfstate-prod"\n    key            = "prod/terraform.tfstate"\n    region         = "ap-northeast-1"\n    dynamodb_table = "terraform-lock"\n    encrypt        = true\n  }\n\n  required_providers {\n    aws = { source = "hashicorp/aws", version = "~> 5.0" }\n  }\n}',
 exp:'State để trên S3 giúp cả team dùng chung một “sổ cái” hạ tầng; DynamoDB lo khoá (lock) để hai người apply cùng lúc không ghi đè state của nhau. Bucket state phải tạo trước (bằng tay hoặc một project Terraform riêng) và bật versioning.',
 expj:'S3 に state を置くとチームで共有でき、DynamoDB のロックで同時 apply の競合を防ぎます。state 用バケットは事前に用意し、バージョニングを有効にします。'},
{id:'tf9',tr:'tf',lv:2,
 t:'Remote state phía GCP: GCS backend',
 q:'Trong block terraform, khai báo backend "gcs" gồm bucket (bucket chứa state) và prefix (thư mục state của môi trường, vd "prod").',
 qj:'terraform ブロック内に backend "gcs" を書き、bucket と prefix（例 "prod"）を含めてください。',
 start:'# tf9 — remote state GCP\n',
 checks:[
  ['Có backend "gcs"','backend "gcs" がある',/backend\s+"gcs"\s*\{/],
  ['Có bucket = "..."','bucket が指定されている',/bucket\s*=\s*"/],
  ['Có prefix = "..."','prefix がある',/prefix\s*=\s*"/]
 ],
 sol:'terraform {\n  backend "gcs" {\n    bucket = "company-tfstate-prod"\n    prefix = "prod"\n  }\n\n  required_providers {\n    google = { source = "hashicorp/google", version = "~> 5.0" }\n  }\n}',
 exp:'GCS backend gọn hơn phía AWS vì Cloud Storage tự có cơ chế khoá state (object lock) — không cần bảng phụ như DynamoDB. Mỗi môi trường dùng một prefix riêng trong cùng bucket state.',
 expj:'GCS バックエンドは Cloud Storage 自体にロック機構があるため、DynamoDB のような補助テーブルが不要です。環境ごとに prefix を分けます。'},
{id:'tf10',tr:'tf',lv:2,
 t:'Dùng module có sẵn (module block)',
 q:'Gọi một module bằng block module có source trỏ tới module local "./modules/vpc" (hoặc module registry terraform-aws-modules/...), và truyền vào ít nhất tham số cidr_block cho module.',
 qj:'module ブロックでローカルモジュール "./modules/vpc"（または terraform-aws-modules/... のレジストリモジュール）を呼び出し、cidr_block パラメータを渡してください。',
 start:'# tf10 — dung module\n',
 checks:[
  ['Có block module "..."','module ブロックがある',/module\s+"[\w-]+\s*"\s*\{/],
  ['source trỏ module local ./modules/ hoặc registry terraform-aws-modules','source が ./modules/ または terraform-aws-modules',/source\s*=\s*"(\.\/modules\/|terraform-aws-modules\/)/],
  ['Truyền tham số cidr_block vào module','モジュールへ cidr_block を渡している',/cidr_block\s*=\s*"/]
 ],
 sol:'module "vpc" {\n  source = "./modules/vpc"\n\n  cidr_block        = "10.0.0.0/16"\n  azs               = ["ap-northeast-1a", "ap-northeast-1c"]\n  public_subnets    = ["10.0.1.0/24", "10.0.2.0/24"]\n  private_subnets   = ["10.0.11.0/24", "10.0.12.0/24"]\n  enable_nat_gateway = true\n\n  tags = { Project = "learning" }\n}',
 exp:'Module là cách “đóng gói” một khối hạ tầng (VPC, EKS…) thành thư viện dùng lại cho dev/staging/prod — chỉ khác nhau ở tham số truyền vào. Team Architect luôn ưu tiên module thay vì copy-paste resource.',
 expj:'モジュールはインフラの塊を再利用可能な部品にする仕組みです。環境差はパラメータだけにし、リソースのコピペを避けるのがアーキテクトの基本です。'},
{id:'tf11',tr:'tf',lv:2,
 t:'GKE cluster bằng Terraform (Autopilot)',
 q:'Tạo resource google_container_cluster ở location asia-northeast1 với enable_autopilot = true (hoặc kèm google_container_node_pool riêng).',
 qj:'location が asia-northeast1 で enable_autopilot = true の google_container_cluster を作成してください（または専用 node pool 併記）。',
 start:'# tf11 — GKE cluster\n',
 checks:[
  ['Có resource "google_container_cluster"','resource "google_container_cluster" がある',/resource\s+"google_container_cluster"\s+"/],
  ['location = "asia-northeast1"','location = "asia-northeast1"',/location\s*=\s*"asia-northeast1"/],
  ['Autopilot (enable_autopilot = true) hoặc có node pool riêng','Autopilot 有効、または専用 node pool',/enable_autopilot\s*=\s*true|resource\s+"google_container_node_pool"/],
  ['Cluster có name = "..."','name が指定されている',/name\s*=\s*"/]
 ],
 sol:'provider "google" {\n  project = var.project_id\n  region  = "asia-northeast1"\n}\n\nresource "google_container_cluster" "prod" {\n  name             = "prod-cluster"\n  location         = "asia-northeast1"\n  enable_autopilot = true\n}',
 exp:'Với Autopilot, Google quản lý luôn node — bạn chỉ khai báo cluster và triển khai workload, trả tiền theo tài nguyên pod xin. Đây là cách dựng GKE “ít việc vận hành nhất” và là lựa chọn mặc định cho team nhỏ.',
 expj:'Autopilot ではノード管理を Google が担い、課金は Pod が要求するリソース単位です。運用負荷が最も小さい GKE の作り方です。'},
/* ---------- KUBERNETES ---------- */
{id:'k1',tr:'k8s',lv:0,
 t:'Pod chạy nginx',
 q:'Viết manifest một Pod (apiVersion v1, kind Pod) chạy container image nginx (bản nào cũng được), có name cho Pod và cho container.',
 qj:'Pod（apiVersion v1、kind Pod）を書き、nginx イメージのコンテナを1つ実行してください。Pod 名とコンテナ名が必要です。',
 start:'# k1 — Pod nginx\n',
 checks:[
  ['apiVersion: v1','apiVersion: v1',/apiVersion:\s*v1/],
  ['kind: Pod','kind: Pod',/kind:\s*Pod/],
  ['image: nginx...','image: nginx...',/image:\s*nginx/],
  ['Có metadata.name cho Pod','Pod の metadata.name がある',/metadata:[\s\S]*?name:\s*\S+/]
 ],
 sol:'apiVersion: v1\nkind: Pod\nmetadata:\n  name: web-pod\n  labels:\n    app: web\nspec:\n  containers:\n    - name: nginx\n      image: nginx:1.27\n      ports:\n        - containerPort: 80',
 exp:'Pod là đơn vị nhỏ nhất của Kubernetes — một “vỏ” chứa 1+ container dùng chung mạng và vòng đời. Thực tế hiếm khi tạo Pod trần; ta tạo qua Deployment để có tự phục hồi và rolling update.',
 expj:'Pod は Kubernetes の最小単位で、ネットワークとライフサイクルを共有するコンテナの入れ物です。実務では自己回復のため Deployment 経由で作るのが基本です。'},
{id:'k2',tr:'k8s',lv:0,
 t:'Deployment 3 replicas',
 q:'Viết Deployment (apps/v1) cho app nginx với replicas: 3, selector.matchLabels và template có cùng label, container image nginx.',
 qj:'Deployment（apps/v1）を書き、nginx を replicas: 3 で動かしてください。selector.matchLabels と template のラベルを一致させること。',
 start:'# k2 — Deployment\n',
 checks:[
  ['kind: Deployment','kind: Deployment',/kind:\s*Deployment/],
  ['replicas: 3','replicas: 3',/replicas:\s*3/],
  ['Có selector.matchLabels','selector.matchLabels がある',/selector:[\s\S]*?matchLabels:/],
  ['Có template (pod template)','template がある',/template:/],
  ['image: nginx...','image: nginx...',/image:\s*nginx/]
 ],
 sol:'apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: web\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: web\n  template:\n    metadata:\n      labels:\n        app: web\n    spec:\n      containers:\n        - name: nginx\n          image: nginx:1.27\n          ports:\n            - containerPort: 80',
 exp:'Điểm hay sai nhất: selector.matchLabels PHẢI khớp đúng labels trong template — lệch một ký tự là API Server từ chối. Deployment giữ luôn đủ 3 pod: pod chết là có pod mới thay ngay.',
 expj:'最も間違えやすいのは selector.matchLabels と template のラベルの不一致で、API サーバーに拒否されます。Deployment は常に指定レプリカ数を維持します。'},
{id:'k3',tr:'k8s',lv:1,
 t:'Service ClusterIP',
 q:'Viết Service kiểu ClusterIP (khai báo rõ type: ClusterIP) trỏ vào các pod có label app: web, với port: 80 và targetPort: 80.',
 qj:'Service（type: ClusterIP を明記）を作成し、app: web ラベルの Pod へ port: 80 → targetPort: 80 でつないでください。',
 start:'# k3 — Service ClusterIP\n',
 checks:[
  ['kind: Service','kind: Service',/kind:\s*Service/],
  ['type: ClusterIP','type: ClusterIP',/type:\s*ClusterIP/],
  ['selector chọn app: web','selector が app: web',/selector:[\s\S]*?app:\s*web/],
  ['port: 80','port: 80',/port:\s*80/],
  ['targetPort: 80','targetPort: 80',/targetPort:\s*80/]
 ],
 sol:'apiVersion: v1\nkind: Service\nmetadata:\n  name: web-svc\nspec:\n  type: ClusterIP\n  selector:\n    app: web\n  ports:\n    - port: 80\n      targetPort: 80',
 exp:'Service cho pod một “địa chỉ + tên DNS” ổn định (web-svc) dù pod phía sau thay đổi liên tục. ClusterIP chỉ truy cập được trong cluster — muốn ra ngoài phải qua Ingress hoặc LoadBalancer.',
 expj:'Service は Pod に安定した名前（DNS）と IP を与えます。ClusterIP はクラスタ内専用で、外へ出すには Ingress や LoadBalancer が必要です。'},
{id:'k4',tr:'k8s',lv:1,
 t:'Service LoadBalancer',
 q:'Viết Service kiểu LoadBalancer cho app web (selector app: web, port 80) — trên EKS/GKE, Service này sẽ được cấp một load balancer thật của cloud.',
 qj:'app: web 向けに type: LoadBalancer の Service（port 80）を書いてください。EKS/GKE ではクラウドのロードバランサーが実際に作られます。',
 start:'# k4 — Service LoadBalancer\n',
 checks:[
  ['kind: Service','kind: Service',/kind:\s*Service/],
  ['type: LoadBalancer','type: LoadBalancer',/type:\s*LoadBalancer/],
  ['selector chọn app: web','selector が app: web',/selector:[\s\S]*?app:\s*web/],
  ['port: 80','port: 80',/port:\s*80/]
 ],
 sol:'apiVersion: v1\nkind: Service\nmetadata:\n  name: web-lb\nspec:\n  type: LoadBalancer\n  selector:\n    app: web\n  ports:\n    - port: 80\n      targetPort: 80',
 exp:'Chỉ đổi type thành LoadBalancer, cloud controller sẽ tự dựng ALB/NLB (AWS) hoặc Cloud Load Balancer (GCP) và gán IP ngoài. Nhớ: mỗi Service LoadBalancer là một LB tính phí riêng — nhiều service nhỏ thì nên dùng Ingress chung.',
 expj:'type を LoadBalancer にすると、クラウド側で実物の LB が作られます。Service ごとに LB 課金が発生するため、小さいサービスが多い場合は Ingress 共有が定石です。'},
{id:'k5',tr:'k8s',lv:1,
 t:'ConfigMap + dùng trong Pod',
 q:'Tạo một ConfigMap có block data chứa ít nhất một khoá cấu hình (vd APP_ENV: "prod"), và một Pod nạp ConfigMap đó qua envFrom (configMapRef) hoặc valueFrom.configMapKeyRef.',
 qj:'data に設定値（例 APP_ENV: "prod"）を持つ ConfigMap と、それを envFrom（configMapRef）または configMapKeyRef で読み込む Pod を書いてください。',
 start:'# k5 — ConfigMap\n',
 checks:[
  ['kind: ConfigMap','kind: ConfigMap',/kind:\s*ConfigMap/],
  ['Có block data:','data: ブロックがある',/data:/],
  ['Pod nạp qua envFrom/valueFrom + configMap','Pod が envFrom/valueFrom で configMap を参照',/(envFrom:|valueFrom:)[\s\S]{0,220}configMap/],
  ['kind: Pod (hoặc Deployment chứa pod template)','kind: Pod（または Deployment）',/kind:\s*(Pod|Deployment)/]
 ],
 sol:'apiVersion: v1\nkind: ConfigMap\nmetadata:\n  name: app-config\ndata:\n  APP_ENV: "prod"\n  LOG_LEVEL: "info"\n---\napiVersion: v1\nkind: Pod\nmetadata:\n  name: web-pod\nspec:\n  containers:\n    - name: nginx\n      image: nginx:1.27\n      envFrom:\n        - configMapRef:\n            name: app-config',
 exp:'ConfigMap tách cấu hình khỏi image: cùng một image chạy dev/prod chỉ khác ConfigMap. Dữ liệu bí mật KHÔNG để ở ConfigMap — đó là việc của Secret.',
 expj:'ConfigMap は設定をイメージから分離します。秘密情報は ConfigMap ではなく Secret の役割です。'},
{id:'k6',tr:'k8s',lv:1,
 t:'Secret + dùng trong Pod',
 q:'Tạo một Secret (type: Opaque, có stringData chứa mật khẩu mẫu) và một Pod đọc Secret đó qua env valueFrom.secretKeyRef hoặc envFrom.secretRef.',
 qj:'Secret（type: Opaque、stringData にパスワード）を作成し、Pod が secretKeyRef または secretRef 経由で読むようにしてください。',
 start:'# k6 — Secret\n',
 checks:[
  ['kind: Secret','kind: Secret',/kind:\s*Secret/],
  ['type: Opaque','type: Opaque',/type:\s*Opaque/],
  ['Có stringData: hoặc data:','stringData: または data: がある',/(stringData|data):/],
  ['Pod đọc qua secretKeyRef/secretRef','Pod が secretKeyRef/secretRef で参照',/(envFrom:|valueFrom:)[\s\S]{0,220}secret/],
  ['kind: Pod (hoặc Deployment chứa pod template)','kind: Pod（または Deployment）',/kind:\s*(Pod|Deployment)/]
 ],
 sol:'apiVersion: v1\nkind: Secret\nmetadata:\n  name: app-secret\ntype: Opaque\nstringData:\n  DB_PASSWORD: "example-password-change-me"\n---\napiVersion: v1\nkind: Pod\nmetadata:\n  name: web-pod\nspec:\n  containers:\n    - name: app\n      image: nginx:1.27\n      env:\n        - name: DB_PASSWORD\n          valueFrom:\n            secretKeyRef:\n              name: app-secret\n              key: DB_PASSWORD',
 exp:'Secret lưu base64 (không phải mã hoá thật!) — production phải bật encryption at rest cho etcd và tốt nhất dùng External Secrets nối Secrets Manager/ Secret Manager của cloud. stringData tiện vì ghi plaintext, API Server tự mã hoá base64.',
 expj:'Secret は base64 なだけで暗号化ではありません。本番では etcd の暗号化や External Secrets とクラウドのシークレット管理の併用が前提です。'},
{id:'k7',tr:'k8s',lv:1,
 t:'Ingress trỏ vào Service',
 q:'Viết Ingress (apiVersion networking.k8s.io/v1, kind Ingress) có rule với host, một path "/" (pathType Prefix) và backend trỏ vào service tên web-svc cổng 80.',
 qj:'Ingress（networking.k8s.io/v1）を作成し、host ルール・path "/"（Prefix）・backend で web-svc の 80 番へつないでください。',
 start:'# k7 — Ingress\n',
 checks:[
  ['apiVersion: networking.k8s.io/v1','apiVersion: networking.k8s.io/v1',/apiVersion:\s*networking\.k8s\.io\/v1/],
  ['kind: Ingress','kind: Ingress',/kind:\s*Ingress/],
  ['Có rule host:','host: がある',/host:\s*\S+/],
  ['path: / với pathType: Prefix','path: / と pathType: Prefix',/path:\s*\/[\s\S]{0,80}pathType:\s*Prefix/],
  ['backend trỏ service web-svc','backend が web-svc を指す',/backend:[\s\S]{0,220}name:\s*web-svc/]
 ],
 sol:'apiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: web-ingress\nspec:\n  ingressClassName: alb\n  rules:\n    - host: example.com\n      http:\n        paths:\n          - path: /\n            pathType: Prefix\n            backend:\n              service:\n                name: web-svc\n                port:\n                  number: 80',
 exp:'Ingress là “bảng chỉ đường lớp 7”: một LB chung route theo host/path tới nhiều Service. Trên EKS, ingressClassName: alb dùng AWS Load Balancer Controller; trên GKE dùng class gce để ra Global Load Balancer.',
 expj:'Ingress はレイヤー7の振り分け表です。EKS では alb クラス、GKE では gce クラスでクラウドの LB と連動します。'},
{id:'k8',tr:'k8s',lv:2,
 t:'PVC + Pod dùng volume bền',
 q:'Tạo PersistentVolumeClaim (accessModes có ReadWriteOnce, resources.requests.storage — vd 1Gi) và một Pod mount claim đó qua volumes.persistentVolumeClaim.claimName.',
 qj:'PersistentVolumeClaim（accessModes に ReadWriteOnce、storage 要求 例 1Gi）と、その claim を volumes.persistentVolumeClaim.claimName でマウントする Pod を書いてください。',
 start:'# k8 — PVC + Pod\n',
 checks:[
  ['kind: PersistentVolumeClaim','kind: PersistentVolumeClaim',/kind:\s*PersistentVolumeClaim/],
  ['accessModes có ReadWriteOnce','accessModes に ReadWriteOnce',/ReadWriteOnce/],
  ['requests.storage (vd 1Gi)','requests.storage（例 1Gi）',/storage:\s*\d+(Gi|Mi)/],
  ['Pod dùng claimName:','Pod が claimName を参照',/claimName:\s*\S+/],
  ['Pod có volumeMounts','Pod に volumeMounts がある',/volumeMounts:/]
 ],
 sol:'apiVersion: v1\nkind: PersistentVolumeClaim\nmetadata:\n  name: app-data\nspec:\n  accessModes:\n    - ReadWriteOnce\n  resources:\n    requests:\n      storage: 1Gi\n---\napiVersion: v1\nkind: Pod\nmetadata:\n  name: web-pod\nspec:\n  containers:\n    - name: nginx\n      image: nginx:1.27\n      volumeMounts:\n        - name: data\n          mountPath: /data\n  volumes:\n    - name: data\n      persistentVolumeClaim:\n        claimName: app-data',
 exp:'Pod là tạm thời — xoá pod là mất dữ liệu trong container. PVC là “phiếu yêu cầu ổ đĩa bền” (EBS/Persistent Disk phía sau): pod gắn phiếu này thì dữ liệu sống sót qua cả việc pod bị tạo lại.',
 expj:'Pod は一時的なので、データ永続化は PVC 経由で行います。PVC の実体は EBS / Persistent Disk です。'},
{id:'k9',tr:'k8s',lv:2,
 t:'Namespace + ResourceQuota',
 q:'Tạo một Namespace, và một ResourceQuota trong namespace đó có spec.hard giới hạn requests.cpu hoặc limits.cpu / limits.memory.',
 qj:'Namespace と、その中に spec.hard で requests.cpu または limits.cpu / limits.memory を制限する ResourceQuota を作成してください。',
 start:'# k9 — Namespace + ResourceQuota\n',
 checks:[
  ['kind: Namespace','kind: Namespace',/kind:\s*Namespace/],
  ['kind: ResourceQuota','kind: ResourceQuota',/kind:\s*ResourceQuota/],
  ['Có spec.hard','spec.hard がある',/hard:/],
  ['Giới hạn cpu hoặc memory trong hard','hard に cpu または memory の制限',/(requests\.cpu|limits\.cpu|limits\.memory|requests\.memory):/]
 ],
 sol:'apiVersion: v1\nkind: Namespace\nmetadata:\n  name: team-a\n---\napiVersion: v1\nkind: ResourceQuota\nmetadata:\n  name: team-a-quota\n  namespace: team-a\nspec:\n  hard:\n    requests.cpu: "4"\n    requests.memory: 8Gi\n    limits.cpu: "8"\n    limits.memory: 16Gi\n    pods: "20"',
 exp:'Namespace chia một cluster vật lý thành nhiều “khu” logic cho các team; ResourceQuota là hạn mức tổng của cả khu để một team không ăn hết tài nguyên cluster. Thường đi kèm LimitRange đặt mặc định cho từng pod.',
 expj:'Namespace はクラスタの論理分割、ResourceQuota はその区画全体の上限です。Pod 単位の既定値は LimitRange が担います。'},
{id:'k10',tr:'k8s',lv:2,
 t:'HPA autoscale theo CPU',
 q:'Viết HorizontalPodAutoscaler (autoscaling/v2) nhắm vào Deployment tên web (scaleTargetRef), minReplicas 2, maxReplicas 10, metric CPU với averageUtilization (vd 70).',
 qj:'HorizontalPodAutoscaler（autoscaling/v2）を書き、Deployment web を対象に minReplicas 2 / maxReplicas 10 / CPU の averageUtilization（例 70）を設定してください。',
 start:'# k10 — HPA\n',
 checks:[
  ['apiVersion: autoscaling/v2','apiVersion: autoscaling/v2',/apiVersion:\s*autoscaling\/v2/],
  ['kind: HorizontalPodAutoscaler','kind: HorizontalPodAutoscaler',/kind:\s*HorizontalPodAutoscaler/],
  ['scaleTargetRef trỏ Deployment web','scaleTargetRef が Deployment web',/scaleTargetRef:[\s\S]{0,160}kind:\s*Deployment[\s\S]{0,80}name:\s*web/],
  ['minReplicas: 2 và maxReplicas: 10','minReplicas: 2 / maxReplicas: 10',/minReplicas:\s*2[\s\S]{0,60}maxReplicas:\s*10/],
  ['metric CPU averageUtilization','CPU の averageUtilization',/averageUtilization:\s*\d+/]
 ],
 sol:'apiVersion: autoscaling/v2\nkind: HorizontalPodAutoscaler\nmetadata:\n  name: web-hpa\nspec:\n  scaleTargetRef:\n    apiVersion: apps/v1\n    kind: Deployment\n    name: web\n  minReplicas: 2\n  maxReplicas: 10\n  metrics:\n    - type: Resource\n      resource:\n        name: cpu\n        target:\n          type: Utilization\n          averageUtilization: 70',
 exp:'HPA scale theo chiều ngang (thêm/bớt pod) dựa trên metric — muốn tính được % CPU thì container PHẢI khai báo resources.requests.cpu, thiếu là HPA đứng im không scale.',
 expj:'HPA は水平スケールです。CPU 使用率を計算するにはコンテナの resources.requests.cpu が必須で、無いとスケールしません。'},
{id:'k11',tr:'k8s',lv:2,
 t:'ServiceAccount + RBAC (Role/RoleBinding)',
 q:'Tạo một ServiceAccount, một Role (rules cho phép get/list pods trong apiGroups core "") và một RoleBinding nối ServiceAccount đó với Role (có subjects và roleRef).',
 qj:'ServiceAccount、Pod の get/list を許可する Role、両者を結ぶ RoleBinding（subjects と roleRef を含む）を作成してください。',
 start:'# k11 — SA + RBAC\n',
 checks:[
  ['kind: ServiceAccount','kind: ServiceAccount',/kind:\s*ServiceAccount/],
  ['kind: Role','kind: Role',/kind:\s*Role/],
  ['Role có rules với verbs get/list','Role の rules に get/list',/verbs:[\s\S]{0,120}(get|list)/],
  ['Role cho tài nguyên pods','Role が pods を対象',/resources:[\s\S]{0,80}pods/],
  ['kind: RoleBinding với subjects + roleRef','RoleBinding に subjects と roleRef',/kind:\s*RoleBinding[\s\S]*subjects:[\s\S]*roleRef:/]
 ],
 sol:'apiVersion: v1\nkind: ServiceAccount\nmetadata:\n  name: app-reader\n---\napiVersion: rbac.authorization.k8s.io/v1\nkind: Role\nmetadata:\n  name: pod-reader\nrules:\n  - apiGroups: [""]\n    resources: ["pods"]\n    verbs: ["get", "list", "watch"]\n---\napiVersion: rbac.authorization.k8s.io/v1\nkind: RoleBinding\nmetadata:\n  name: read-pods\nsubjects:\n  - kind: ServiceAccount\n    name: app-reader\nroleRef:\n  kind: Role\n  name: pod-reader\n  apiGroup: rbac.authorization.k8s.io',
 exp:'RBAC = 3 mảnh: danh tính (ServiceAccount), quyền (Role: verbs × resources), và dây nối (RoleBinding). Trên EKS/GKE, ServiceAccount còn được ánh xạ sang IAM role của cloud (IRSA / Workload Identity) để pod gọi API cloud an toàn.',
 expj:'RBAC は身分（ServiceAccount）・権限（Role）・結び付け（RoleBinding）の3点セットです。クラウド側の IAM との連携は IRSA / Workload Identity が担います。'},
{id:'k12',tr:'k8s',lv:1,
 t:'CronJob chạy định kỳ',
 q:'Viết một CronJob (batch/v1) với schedule dạng cron (vd "0 2 * * *"), có jobTemplate và container chạy lệnh, restartPolicy là OnFailure hoặc Never.',
 qj:'CronJob（batch/v1）を書き、schedule（例 "0 2 * * *"）、jobTemplate、restartPolicy（OnFailure または Never）を含めてください。',
 start:'# k12 — CronJob\n',
 checks:[
  ['kind: CronJob','kind: CronJob',/kind:\s*CronJob/],
  ['schedule dạng cron "..."','schedule が cron 形式',/schedule:\s*"[0-9*\/,\- ]+"/],
  ['Có jobTemplate:','jobTemplate がある',/jobTemplate:/],
  ['restartPolicy: OnFailure hoặc Never','restartPolicy が OnFailure / Never',/restartPolicy:\s*(OnFailure|Never)/]
 ],
 sol:'apiVersion: batch/v1\nkind: CronJob\nmetadata:\n  name: nightly-report\nspec:\n  schedule: "0 2 * * *"\n  jobTemplate:\n    spec:\n      template:\n        spec:\n          containers:\n            - name: report\n              image: busybox:1.36\n              args: ["/bin/sh", "-c", "echo generating report; date"]\n          restartPolicy: OnFailure',
 exp:'CronJob = Job + lịch cron: tới giờ là tự sinh một Job chạy một lần rồi kết thúc. Việc chạy một lần không lịch thì dùng Job trần (kind: Job, completions: 1). Lưu ý múi giờ của controller mặc định theo giờ cluster.',
 expj:'CronJob は Job に cron スケジュールを付けたものです。単発実行は Job 単体を使います。'},
{id:'k13',tr:'k8s',lv:2,
 t:'NetworkPolicy chặn/lọc traffic giữa các pod',
 q:'Viết NetworkPolicy chọn pod app: web (podSelector), có policyTypes chứa Ingress, và rule ingress.from chỉ cho phép pod app: frontend vào.',
 qj:'NetworkPolicy を書き、app: web の Pod（podSelector）を対象に、policyTypes に Ingress を含み、ingress.from で app: frontend の Pod だけを許可してください。',
 start:'# k13 — NetworkPolicy\n',
 checks:[
  ['kind: NetworkPolicy','kind: NetworkPolicy',/kind:\s*NetworkPolicy/],
  ['Có podSelector:','podSelector がある',/podSelector:/],
  ['policyTypes chứa Ingress','policyTypes に Ingress',/policyTypes:[\s\S]{0,60}-\s*Ingress/],
  ['ingress.from giới hạn nguồn vào','ingress.from で送信元を制限',/ingress:[\s\S]{0,160}from:/],
  ['Nguồn được phép có podSelector (app: frontend)','許可元に podSelector（app: frontend）',/from:[\s\S]{0,200}app:\s*frontend/]
 ],
 sol:'apiVersion: networking.k8s.io/v1\nkind: NetworkPolicy\nmetadata:\n  name: web-netpol\nspec:\n  podSelector:\n    matchLabels:\n      app: web\n  policyTypes:\n    - Ingress\n  ingress:\n    - from:\n        - podSelector:\n            matchLabels:\n              app: frontend\n      ports:\n        - protocol: TCP\n          port: 80',
 exp:'Mặc định pod nào cũng nói chuyện được với pod nào (flat network). NetworkPolicy là “tường lửa theo label”: chỉ khi có policy chọn pod thì traffic không khớp rule mới bị chặn — và CNI phải hỗ trợ (EKS dùng VPC CNI + policy engine, GKE dùng Network Policy của Dataplane).',
 expj:'既定では Pod 間は全通です。NetworkPolicy はラベル基準のファイアウォールで、CNI 側の対応が必要です。'}
];

/* ================= TRANG #/iac ================= */
var mainEl=document.querySelector('main');
var page=document.createElement('section');
page.id='iacPage'; page.className='page-off';
page.innerHTML='<div class="wrap">'
 +'<div class="sec-head"><span class="sec-tag">Trang riêng · IaC</span>'
 +'<h2 id="iacTitle"></h2><p id="iacIntro"></p></div>'
 +'<div class="cmd-controls">'
 +'<label><span data-iac-l="track"></span><select id="iacTrack"><option value="tf">Terraform (HCL)</option><option value="k8s">Kubernetes (YAML)</option></select></label>'
 +'<label><span data-iac-l="level"></span><select id="iacLevel"><option value="all">Tất cả</option><option value="0">Cơ bản</option><option value="1">Trung cấp</option><option value="2">Nâng cao</option></select></label>'
 +'<div class="cmd-score"><span id="iacScoreText"></span><div class="cmd-progress"><div id="iacProgress"></div></div></div>'
 +'</div>'
 +'<div class="iac-chips" id="iacChips" role="group" aria-label="Danh sách bài"></div>'
 +'<div class="term-card iac-card"><div class="term-head"><span class="tdots">● ● ●</span><span id="iacExTitle">editor</span></div>'
 +'<div class="term-body">'
 +'<p class="ex-prompt" id="iacPrompt"></p><p class="ex-prompt-ja" id="iacPromptJa"></p>'
 +'<div class="iac-editor-wrap"><textarea id="iacEditor" spellcheck="false" autocomplete="off" autocapitalize="off" rows="13" aria-label="Khung viết code"></textarea></div>'
 +'<div class="term-actions">'
 +'<button type="button" class="btn btn-o" id="iacCheck"></button>'
 +'<button type="button" class="btn btn-g" id="iacShowSol"></button>'
 +'<button type="button" class="btn btn-g" id="iacPrev"></button>'
 +'<button type="button" class="btn btn-g" id="iacNext"></button>'
 +'</div>'
 +'<div id="iacFeedback" hidden></div>'
 +'<div id="iacSolution" hidden></div>'
 +'</div></div>'
 +'<div class="diagram-card"><h3 id="iacHowTitle"></h3><p id="iacHow"></p></div>'
 +'</div>';
if(mainEl) mainEl.appendChild(page);

var SKEY='khoameow_iac_v1';
function loadSolved(){ try{ return JSON.parse(localStorage.getItem(SKEY)||'{}'); }catch(e){ return {}; } }
function saveSolved(s){ try{ localStorage.setItem(SKEY,JSON.stringify(s)); }catch(e){} }
var solved=loadSolved();
var st={tr:'tf',lv:'all',idx:0,code:null,showSol:false,fb:null};

function pool(){ return IAC.filter(function(e){ return e.tr===st.tr && (st.lv==='all'||e.lv===+st.lv); }); }
function cur(){ var p=pool(); return p.length?p[st.idx%p.length]:null; }
function solvedCount(){ return IAC.filter(function(e){ return solved[e.id]; }).length; }

function updateProgress(){
  var n=solvedCount();
  $('iacScoreText').textContent=L('Đã đạt '+n+'/'+IAC.length+' bài','達成 '+n+'/'+IAC.length+' 問');
  $('iacProgress').style.width=(IAC.length?n/IAC.length*100:0)+'%';
}
function renderChips(){
  var p=pool();
  $('iacChips').innerHTML=p.map(function(e,i){
    return '<button type="button" class="iac-chip'+(i===st.idx%p.length?' on':'')+(solved[e.id]?' done':'')+'" data-iac-chip="'+i+'">'+(solved[e.id]?'✓ ':'')+(e.tr==='tf'?'TF':'K8s')+' '+(IAC.indexOf(e)+1)+'</button>';
  }).join('')||'<span class="iac-none">'+L('Không có bài ở cấp độ này.','このレベルの問題はありません。')+'</span>';
  $('iacChips').querySelectorAll('[data-iac-chip]').forEach(function(b){
    b.addEventListener('click',function(){ gotoEx(+b.getAttribute('data-iac-chip')); });
  });
}
function gotoEx(i){
  var p=pool(); if(!p.length) return;
  st.idx=((i%p.length)+p.length)%p.length;
  st.code=null; st.showSol=false; st.fb=null;
  renderEx();
}
function renderEx(){
  /* nhãn tĩnh theo ngôn ngữ */
  $('iacTitle').textContent=L('Luyện viết Terraform & Kubernetes','Terraform & Kubernetes コード演習');
  $('iacIntro').textContent=L('Viết code thật thay vì chỉ đọc: 24 bài — 11 bài Terraform (HCL) và 13 bài Kubernetes (YAML) — chia 3 cấp độ. Gõ code vào khung soạn thảo rồi bấm Kiểm tra: hệ thống chấm theo các yếu tố bắt buộc của từng bài (đúng loại resource/object và các trường then chốt), báo rõ điểm nào đã đạt, điểm nào còn thiếu — không bắt khớp từng ký tự. Bấm Xem lời giải mẫu để đối chiếu đáp án hoàn chỉnh kèm giải thích.','読むだけでなく実際に書く演習です。全24問（Terraform 11問＋Kubernetes 13問）、3レベル制。エディタに書いて「チェック」を押すと、必須要素（リソース種別と重要フィールド）で採点し、達成／不足を項目ごとに表示します。模範解答と解説も確認できます。');
  page.querySelector('[data-iac-l="track"]').textContent=L('Lộ trình: ','コース：');
  page.querySelector('[data-iac-l="level"]').textContent=L('Cấp độ: ','レベル：');
  $('iacCheck').textContent=L('Kiểm tra','チェック');
  $('iacShowSol').textContent=L('Xem lời giải mẫu','模範解答を見る');
  $('iacPrev').textContent=L('← Bài trước','← 前の問題');
  $('iacNext').textContent=L('Bài tiếp theo →','次の問題 →');
  $('iacHowTitle').textContent=L('Cách chấm & cách học hiệu quả','採点方法と効果的な学び方');
  $('iacHow').textContent=L('Mỗi bài có 3–5 yếu tố bắt buộc lấy đúng từ bản chất của resource/object đó (vd: Deployment phải khớp selector với template labels; remote state phải có cơ chế khoá). Viết thiếu dấu, sai thụt dòng YAML hay quên một trường then chốt đều được chỉ ra ở phần phản hồi. Học hiệu quả nhất: tự viết trước → kiểm tra → chỉ mở lời giải mẫu khi đã bí thật sự → viết lại một lần nữa không nhìn mẫu. Code ở đây là mô phỏng chấm trên trình duyệt, không chạy terraform apply/kubectl thật.','各問題には3〜5個の必須要素があります（例：Deployment は selector とテンプレートのラベル一致、リモート state はロック機構）。不足はフィードバックで具体的に指摘されます。まず自力で書き、詰まった時だけ模範解答を開き、最後にもう一度見ずに書くのが効果的です。採点はブラウザ上の模擬で、実際の apply は行いません。');
  updateProgress(); renderChips();
  var e=cur();
  var ta=$('iacEditor'), fb=$('iacFeedback'), sol=$('iacSolution');
  if(!e){
    $('iacExTitle').textContent='editor';
    $('iacPrompt').textContent=L('Không có bài ở cấp độ này. Hãy chọn cấp độ khác.','このレベルの問題はありません。別のレベルを選んでください。');
    $('iacPromptJa').textContent=''; ta.value=''; fb.hidden=true; sol.hidden=true;
    return;
  }
  var p=pool();
  $('iacExTitle').textContent='editor — '+(e.tr==='tf'?'Terraform · HCL':'Kubernetes · YAML')+' · '+L(LVN[e.lv],LVJ[e.lv])+' · '+L('Bài','問題')+' '+(st.idx%p.length+1)+'/'+p.length+(solved[e.id]?' · ✓ '+L('đã đạt','達成済み'):'');
  $('iacPrompt').textContent=(e.tr==='tf'?'Terraform':'Kubernetes')+' · '+e.t+': '+e.q;
  $('iacPromptJa').textContent=e.qj;
  if(st.code===null) st.code=e.start;
  if(ta.value!==st.code) ta.value=st.code;
  /* phản hồi chấm */
  if(st.fb){
    fb.hidden=false;
    fb.className='ex-feedback '+(st.fb.all?'ok':'ng');
    fb.innerHTML=st.fb.html;
  } else fb.hidden=true;
  /* lời giải mẫu */
  if(st.showSol){
    sol.hidden=false;
    sol.innerHTML='<div class="iac-sol-head">'+L('Lời giải mẫu','模範解答')+'</div>'
      +'<div class="code-wrap"><pre class="code">'+E(e.sol)+'</pre></div>'
      +'<p class="iac-sol-exp">'+E(L(e.exp,e.expj))+'</p>'
      +'<button type="button" class="btn btn-g" id="iacFill">'+L('Điền lời giải vào khung để thử chấm','模範解答をエディタに入れて採点してみる')+'</button>';
    var f=$('iacFill');
    if(f) f.addEventListener('click',function(){ st.code=e.sol; ta.value=e.sol; st.fb=null; renderEx(); ta.focus(); });
  } else sol.hidden=true;
  if(window.__applyJA&&window.LANG!=='ja'){} /* giữ nguyên: trang tự song ngữ */
}

function runCheck(){
  var e=cur(); if(!e) return;
  var code=$('iacEditor').value; st.code=code;
  var res=e.checks.map(function(c){ return {vi:c[0],ja:c[1],ok:c[2].test(code)}; });
  var all=res.every(function(r){ return r.ok; });
  var miss=res.filter(function(r){ return !r.ok; }).length;
  var html='<b>'+(all?L('Đạt! Bài này đã hoàn thành.','合格！この問題は達成です。'):L('Chưa đạt — còn thiếu '+miss+' yếu tố bắt buộc:','未達成 — 必須要素があと '+miss+' 個不足しています：'))+'</b>'
    +'<ul class="iac-checklist">'
    +res.map(function(r){ return '<li class="'+(r.ok?'ok':'ng')+'">'+(r.ok?'✓ ':'✗ ')+E(L(r.vi,r.ja))+'</li>'; }).join('')
    +'</ul>'
    +(all?'':'<span class="iac-fb-note">'+L('Sửa đúng các mục ✗ rồi bấm Kiểm tra lại — chấm theo yếu tố, không cần khớp từng ký tự với lời giải mẫu.','✗ の項目を直して再チェックしてください。模範解答との完全一致は不要です。')+'</span>');
  st.fb={all:all,html:html};
  if(all&&!solved[e.id]){ solved[e.id]=true; saveSolved(solved); }
  renderEx();
}

$('iacEditor').addEventListener('input',function(){ st.code=this.value; });
$('iacEditor').addEventListener('keydown',function(ev){
  if(ev.key==='Tab'){ ev.preventDefault(); var s=this.selectionStart; this.value=this.value.slice(0,s)+'  '+this.value.slice(this.selectionEnd); this.selectionStart=this.selectionEnd=s+2; st.code=this.value; }
});
$('iacCheck').addEventListener('click',runCheck);
$('iacShowSol').addEventListener('click',function(){ st.showSol=!st.showSol; renderEx(); });
$('iacPrev').addEventListener('click',function(){ gotoEx(st.idx-1); });
$('iacNext').addEventListener('click',function(){ gotoEx(st.idx+1); });
$('iacTrack').addEventListener('change',function(){ st.tr=this.value; st.idx=0; st.code=null; st.showSol=false; st.fb=null; renderEx(); });
$('iacLevel').addEventListener('change',function(){ st.lv=this.value; st.idx=0; st.code=null; st.showSol=false; st.fb=null; renderEx(); });

/* ================= NAVBAR + ROUTE #/iac ================= */
var navLinkIac=null;
try{
  var labsLink=document.querySelector('nav.top .nav-panel a[data-route="#/labs"]');
  var panel=labsLink?labsLink.closest('.nav-panel'):null;
  if(panel){
    navLinkIac=document.createElement('a');
    navLinkIac.href='#/iac'; navLinkIac.setAttribute('data-route','#/iac');
    navLinkIac.addEventListener('click',function(){
      var g=navLinkIac.closest('.nav-group');
      if(g){ g.classList.remove('open'); var b=g.querySelector('.nav-pillar'); if(b) b.setAttribute('aria-expanded','false'); }
    });
    panel.appendChild(navLinkIac);
  }
  var hubGrid=document.querySelector('.hub-grid');
  if(hubGrid){
    var hc=document.createElement('a'); hc.className='hub-card'; hc.href='#/iac';
    hc.innerHTML='<span class="hub-ic">⌨️</span><b>Luyện viết Terraform &amp; Kubernetes</b><p>24 bài viết code HCL/YAML có chấm điểm theo yếu tố bắt buộc: provider, VPC, EC2, IAM, remote state, module, GKE — và Pod, Deployment, Service, Ingress, HPA, RBAC… kèm lời giải mẫu.</p>';
    hubGrid.appendChild(hc);
  }
}catch(e){}
function navLabelIac(){ if(navLinkIac) navLinkIac.textContent=L('Luyện Terraform & K8s','Terraform & K8s 演習'); }
navLabelIac();

var KNOWN=['homeHub','services','labs','migration','diagrams','networking','du-an','architect','command','glossary','deploy','svcDetailPage','labDetailPage','comparePage','archLibPage','flowPage','pricingPage','decisionsPage','iacPage'];
function routeIac(){
  var h=location.hash||'#/';
  if(h==='#/iac'){
    KNOWN.forEach(function(id){ var el=$(id); if(el) el.classList.toggle('page-off',id!=='iacPage'); });
    var hero=document.querySelector('header.hero'); if(hero) hero.classList.add('page-off');
    document.querySelectorAll('nav.top a[data-route]').forEach(function(a){ a.classList.toggle('act',a.getAttribute('data-route')==='#/iac'); });
    renderEx();
    window.scrollTo(0,0);
  }else{
    page.classList.add('page-off');
  }
}
window.addEventListener('hashchange',routeIac);

/* Đổi ngôn ngữ: vẽ lại trang theo ngôn ngữ mới, giữ nguyên code đang gõ */
['langVi','langJa'].forEach(function(id){
  var b=$(id); if(!b) return;
  b.addEventListener('click',function(){
    setTimeout(function(){ navLabelIac(); if((location.hash||'')==='#/iac') renderEx(); },80);
  });
});

routeIac();
})();

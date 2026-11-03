# Học AWS & Google Cloud — Labs, Migration & Networking

Trang web học Cloud song song **AWS** và **Google Cloud**, deploy bằng GitHub Pages.

🌐 Website: https://khoameow.github.io/aws-gcp-cloud-learning/

## Nội dung chính

- **Chi tiết từng service** — đầy đủ danh mục service mới nhất của AWS (200+) và Google Cloud (100+), mỗi service đều có icon riêng kèm theo
- **So sánh AWS vs GCP** — bảng đối chiếu service tương đương, điểm giống/khác và cách chọn
- **Labs thực tế** — bài lab từng bước bằng AWS CLI / gcloud CLI, kèm Terraform
- **Labs Migration** — di chuyển từ on-premises, VMware, Azure, GCP lên AWS và ngược lại (MGN, DMS, DataSync, Migrate to Virtual Machines, GCVE, Storage Transfer Service...)
- **Sơ đồ kiến trúc chi tiết** — hiển thị cấu hình service, hiệu ứng animation luồng dữ liệu
- **AWS & GCP Networking đến bậc thầy** — VPC, load balancing, hybrid connectivity, Direct Connect / Cloud Interconnect
- **Thiết kế & phân tích dự án** — từ yêu cầu đến kiến trúc, chi phí, bảo mật và triển khai

## Lộ trình Cloud Architect (AWS & GCP)

- **Terraform (IaC)** — HCL, provider AWS & Google, remote state (S3 + DynamoDB lock / GCS), module, policy as code, CI/CD bằng GitHub Actions; lab triển khai cùng kiến trúc 3-tier lên cả AWS và GCP
- **Kubernetes** — Pod, Deployment, Service, Ingress/Gateway API, Helm, Kustomize, GitOps (Argo CD/Flux), HPA, NetworkPolicy, RBAC; so sánh sâu EKS vs GKE (IRSA vs Workload Identity, Autopilot)
- **Kiến thức nền tảng** — Linux, mạng (TCP/IP, DNS, TLS), Git/GitHub, Docker, CI/CD, Bash/Python, SQL & NoSQL, REST/gRPC/GraphQL, microservices, event-driven, serverless
- **Kiến trúc hệ thống** — AWS Well-Architected Framework & Google Cloud Architecture Framework, HA/DR (RTO/RPO, multi-AZ, multi-region), FinOps, bảo mật zero trust, observability (SLI/SLO/SLA)
- **Lộ trình chứng chỉ song song** — AWS Solutions Architect Associate/Professional & Networking/Security Specialty ↔ Google Associate Cloud Engineer / Professional Cloud Architect / Professional Cloud Network & Security Engineer
- **Capstone project** — phân tích yêu cầu doanh nghiệp → chọn cloud → vẽ kiến trúc → Terraform → Kubernetes → CI/CD → monitoring → tài liệu vận hành & chi phí

## Giao diện

Nền cyberpunk / cyberfunk tương lai: nền tối, lưới neon, thẻ glassmorphism phát sáng, code block kiểu terminal.

## Deploy

Trang tĩnh 100% (HTML/CSS/JS). File chính `index.html` đặt ở thư mục gốc, bật GitHub Pages tại Settings → Pages → Deploy from a branch → `main` / `(root)`.

---

*Trạng thái: website đang được xây dựng, `index.html` sẽ được đẩy lên ngay khi hoàn thành.*

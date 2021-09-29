// level: 水平分层(physical/virtual/os/service/app)
// class: 垂直分类(infra/storage/security/network/system/db/product)
// column: 放在同class内的第n列，默认1
var modelList = [
  // system
  { value: "OS主机", level: "os", class: "system" },
  { value: "X86虚拟机", level: "virtual", class: "system" },
  { value: "X86物理机", level: "physical", class: "system" },
  { value: "RS6000物理设备", level: "physical", class: "system", column: 2 },
  { value: "RS6000LPAR", level: "virtual", class: "system", column: 2 },
  { value: "ACS物理机", level: "physical", class: "system", column: 3 },
  { value: "ACS虚拟机", level: "virtual", class: "system", column: 3 },
  { value: "DockerApp", level: "service", class: "system" },
  { value: "服务单元", level: "service", class: "system" },
  { value: "发布单元", level: "service", class: "system" },
  { value: "进程端口", level: "service", class: "system", column: 2 },
  { value: "中间件实例", level: "service", class: "system", column: 3 },
  { value: "系统/子系统", level: "service", class: "system", column: 4 },
  // security
  { value: "安全设备", level: "physical", class: "security" },
  { value: "安全室F5LTM", level: "virtual", class: "security" },
  // storage
  { value: "存储设备", level: "physical", class: "storage" },
  { value: "SAN交换机", level: "physical", class: "storage" },
  { value: "存储LUN", level: "virtual", class: "storage" },
  // db
  { value: "物理数据库", level: "service", class: "db" },
  { value: "虚拟数据库", level: "service", class: "db" },
  // network
  { value: "网络设备", level: "physical", class: "network" },
  { value: "F5设备", level: "physical", class: "network" },
  { value: "IP地址", level: "virtual", class: "network" },
  { value: "IP网段", level: "virtual", class: "network", column: 2 },
  { value: "网络室F5LTM", level: "virtual", class: "network" },
  { value: "VIP地址", level: "virtual", class: "network" },
  { value: "域名", level: "service", class: "network" },
  // infra
  { value: "机房设施", level: "physical", class: "infra" },
  { value: "实物资产管理", level: "virtual", class: "infra"},
  // product
  { value: "制品", level: "app", class: "product" },
  { value: "项目信息", level: "service", class: "product"},
];

const subModelList = [
  { value: "防火墙策略", level: "service", class: "network" },
  { value: "域名映射", level: "service", class: "network" },
  { value: "DockerPod", level: "service", class: "system", column: 2 },
  { value: "Docker产品", level: "app", class: "system" },
]

const edgeList = [
  { source: "ACS虚拟机", target: "ACS物理机" },
  { source: "ACS虚拟机", target: "OS主机" },
  { source: "ACS物理机", target: "OS主机", lineStyle: { curveness: -0.1 } },

  { source: "制品", target: "DockerApp" },

  { source: "机房设施", target: "F5设备", lineStyle: { curveness: 0.08 } },
  { source: "机房设施", target: "网络设备", lineStyle: { curveness: -0.2 } },
  { source: "机房设施", target: "实物资产管理" },
  { source: "机房设施", target: "RS6000物理设备", lineStyle: { curveness: -0.2 } },
  { source: "机房设施", target: "安全设备", lineStyle: { curveness: -0.2 } },
  { source: "机房设施", target: "存储设备", lineStyle: { curveness: -0.2 } },
  { source: "机房设施", target: "X86物理机", lineStyle: { curveness: -0.2 } },

  { source: "DockerApp", target: "OS主机" },

  { source: "域名", target: "IP地址", lineStyle: { curveness: 0.45 } },
  { source: "域名", target: "服务单元" },

  { source: "网络室F5LTM", target: "服务单元" },
  { source: "网络室F5LTM", target: "VIP地址" },

  { source: "F5设备", target: "网络室F5LTM" },
  { source: "F5设备", target: "安全室F5LTM" },
  { source: "F5设备", target: "网络设备" },

  { source: "安全室F5LTM", target: "IP地址" },
  { source: "安全室F5LTM", target: "VIP地址" },

  { source: "IP地址", target: "网络室F5LTM" },
  { source: "IP地址", target: "F5设备" },
  { source: "IP地址", target: "逻辑数据库" },
  { source: "IP地址", target: "网络设备" },
  { source: "IP地址", target: "OS主机" },
  { source: "IP地址", target: "SAN交换机" },
  { source: "IP地址", target: "安全设备" },
  { source: "IP地址", target: "存储设备" },
  { source: "IP地址", target: "X86物理机" },

  { source: "IP网段", target: "IP地址" },

  { source: "逻辑数据库", target: "物理数据库" },
  { source: "中间件实例", target: "OS主机" },

  { source: "网络设备", target: "IP网段" },
  { source: "网络设备", target: "OS主机", lineStyle: { curveness: -0.3 } },

  { source: "OS主机", target: "制品", lineStyle: { curveness: 0.25 } },
  { source: "OS主机", target: "物理数据库", lineStyle: { curveness: -0.1 } },
  // { source: "OS主机", target: "存储设备" },

  // { source: "实物资产管理", target: "F5设备", lineStyle: { curveness: -0.1 } },

  { source: "进程端口", target: "OS主机" },

  { source: "项目信息", target: "制品" },

  { source: "发布单元", target: "制品", lineStyle: { curveness: 0.1 } },

  { source: "RS6000物理设备", target: "OS主机", lineStyle: { curveness: -0.05 } },
  { source: "RS6000物理设备", target: "RS6000LPAR" },
  { source: "RS6000LPAR", target: "OS主机" },

  { source: "SAN交换机", target: "OS主机", lineStyle: { curveness: 0.33 } },

  { source: "安全设备", target: "OS主机", lineStyle: { curveness: 0.9 } },

  { source: "服务单元", target: "DockerApp" },
  { source: "服务单元", target: "虚拟数据库" },
  { source: "服务单元", target: "OS主机", lineStyle: { curveness: 0.7 } },
  { source: "服务单元", target: "发布单元" },
  { source: "服务单元", target: "VIP地址" },

  { source: "存储设备", target: "SAN交换机" },

  { source: "存储LUN", target: "OS主机" },
  { source: "存储LUN", target: "存储设备", lineStyle: { curveness: -0.7 } },

  { source: "系统/子系统", target: "OS主机", lineStyle: { curveness: 0.1 } },
  { source: "系统/子系统", target: "发布单元" },
  { source: "系统/子系统", target: "服务单元", lineStyle: { curveness: -0.1 } },

  { source: "VIP地址", target: "OS主机" },

  { source: "X86物理机", target: "OS主机", lineStyle: { curveness: -0.25 } },
  { source: "X86物理机", target: "X86虚拟机" },
  { source: "X86虚拟机", target: "OS主机" },

  // 追加
  { source: "安全设备", target: "防火墙策略" },
  { source: "域名映射", target: "VIP地址", lineStyle: { curveness: -0.4 } },

];

export { modelList, edgeList, subModelList };

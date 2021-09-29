var dashboardData = {
  columnInfoSts: [
    {
      prop: "dbType",
      label: "数据库类型",
      width: "110",
    },
    {
      prop: "dbName",
      label: "名称",
      width: "140",
    },
    {
      prop: "dbVersion",
      label: "镜像版本",
      width: "110",
    },
    {
      prop: "dbReplicas",
      label: "副本数",
      width: "100",
    }, 
    // {
    //   prop: "dbPort",
    //   label: "端口号",
    //   width: "80",
    // }, 
    {
      prop: "dbCreateTime",
      label: "创建时间"
    }
  ],
  columnInfoPods: [
    {
      prop: "podName",
      label: "Pod Name",
      width: "150"
    },  
    {
      prop: "containerCount",
      label: "容器数",
      width: "80",
    }, 
    {
      prop: "podNode",
      label: "所在节点",
      width: "130",
    }, 
    {
      prop: "podStatus",
      label: "Pod Status",
      width: "110",
    }, 
    {
      prop: "podCreateTime",
      label: "Pod创建时间",
      // width: "150",
    }
  ]
}

export default dashboardData
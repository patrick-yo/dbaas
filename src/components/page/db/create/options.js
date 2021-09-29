var createDbOptions = {
  dbTypeOpt: [{
    value: 'postgresql',
    label: 'PostgreSQL'
  }, {
    value: 'mysql',
    label: 'MySQL'
  }, {
    value: 'mongodb',
    label: 'MongoDB',
    disabled: true,    
  }],
  clusterOpt: [{
    value: "single",
    label: "非集群模式"
  }, {
    value: "ioSperate",
    label: "读写分离"
  }, {
    value: "ha",
    label: "高可用模式",
    disabled: true
  }],
  imageOpt: {
    postgresql: ["12.7", "13.2", "9.6"],
    mysql: ["5.7", "8.0"]
  },
}

export default createDbOptions
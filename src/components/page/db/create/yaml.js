var createYamlTemplate = {
  "apiVersion": "dbaas.dbaas.bayss.com/v1",
  "kind": "PostgreSQLDB",
  "metadata": {
    "name": "",
    "namespace": "dbaas" // this.createDbForm.dbName,
  },
  "spec": {
    "replica": "", // this.createDbForm.replicaNum,
    "version": "", // this.createDbForm.imageVersion,
    "secretName": "pgsql-secret",
    "storage": {
      // "storageClassName": "nfs-client",
      "storageClassName": "managed-nfs-storage",
      "accessMode": "ReadWriteOnce",
      "resource": {
        "requests": {
          "storage": "2Gi"
        }
      }
    },
    "service": {
      "port": 5432  
    },
    
    "container": {
      "name": "pgsql13-container",
      "port": 5432,
      "volumeMounts": {
        "name": "pg-volume",
        "mountPath": "/var/lib/postgresql/data1"
      }
    }
  }
}

export default createYamlTemplate
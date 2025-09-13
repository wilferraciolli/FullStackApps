# Go Lang Azure storage download manager
API used to manage blobs within Azure

### initial project set up
Run the following commands to create the app
mkdir azure-blob-downloader
cd azure-blob-downloader
```bash
    go mod init wiltech/azure-blob-manager
````

### Running the app
```bash
    go run main.go
```

### Refreshing dependencies
```bash
    go run mod tidy
```


## Dependencies

### Env files reader
Go to Env
```bash
    go get github.com/joho/godotenv
```

### Azure SDK
```bash
    go get github.com/Azure/azure-sdk-for-go/sdk/storage/azblob
    go get github.com/Azure/azure-sdk-for-go/sdk/azidentity
```


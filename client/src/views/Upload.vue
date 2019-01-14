<template>
  <div class="upload">
    <h1>This is the Upload page</h1>
    <ul>
        <li>Select the file</li>
        <li>Tag the columns</li>
        <ul>
            <li>Show 5 most recent transactions</li>
            <li>Auto detect dates</li>
            <li>Make suggestion of the following order and have user confirm/reject it</li>
            <ul>
                <li>Date</li>
                <li>Description</li>
                <li>Withdrawn</li>
                <li>Deposited</li>
                <li>Balance</li>
            </ul>
        </ul>
        <li>Confirm the upload</li>
        <li>Validate file type</li>
    </ul>
    <!-- <form method="post" enctype="multipart/form-data"> -->
        <label class="btn btn-xs">
            <input class="form-control" type="file"
            @change="onFileChanged">
            <button class="btn btn-primary"
            @click="onUpload">
                Upload</button>
        </label>
    <!-- </form> -->
    <br>
    {{uploadProgress}}
    <br>
    {{selectedFile}}

  </div>
</template>
<script>
import axios from 'axios'

export default{
    data () {
        return {
            selectedFile: null,
            uploadProgress: null
        }
    },
    methods: {
        onFileChanged (event) {
            this.selectedFile = event.target.files[0]
        },
        onUpload() {
            const formData = new FormData()
            formData.append('myFile', this.selectedFile, this.selectedFile.name)
            axios.post('http://localhost:5000/transactions/upload', formData, {
                onUploadProgress: progressEvent => {
                    this.uploadProgress = (progressEvent.loaded / progressEvent.total);
                }
            })
        }
    }
}
</script>

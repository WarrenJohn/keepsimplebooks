<template>
  <div class="upload">
    <h1>This is the Upload page</h1>
    <p>Confirm the column headings:</p>
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
            <input class="form-control" type="file" accept=".csv"
            @change="onFileChanged">
            <br>
            <button class="btn btn-primary"
            @click="onUpload">
                Upload</button>
        </label>
        <div v-if="clientResponseClass">
            <b-alert show :variant="clientResponseClass">
                {{clientResponse}}
            </b-alert>
        </div>
    <!-- </form> -->
    <br>
    {{uploadProgress}}
    <br>
    {{test}}

  </div>
</template>
<script>
import axios from 'axios'

export default{
    data () {
        return {
            selectedFile: null,
            uploadProgress: null,
            clientResponse: null,
            clientResponseClass: null,
            test: null
        }
    },
    methods: {
        onFileChanged (event) {
            this.selectedFile = event.target.files[0];
        },
        onUpload() {
            if (!this.selectedFile){
                this.clientResponseClass = 'warning text-center';
                setTimeout(() => {this.clientResponseClass = null}, 3000);
                this.clientResponse = 'Please select a file';
            }else{
                const formData = new FormData()
                formData.append('bank', this.selectedFile)
                axios.post('http://localhost:5000/transactions/upload', formData)
                    .then(() => {
                        this.clientResponseClass = 'success text-center';
                        setTimeout(() => {this.clientResponseClass = null}, 3000);
                        this.clientResponse = 'Files Uploaded!';
                    })
                    .catch(error => {
                        console.log(error);
                        this.clientResponseClass = 'danger text-center';
                        setTimeout(() => {this.clientResponseClass = null}, 3000);
                        this.clientResponse = 'Something went wrong';
                    })
            }
        }
    }
}
</script>

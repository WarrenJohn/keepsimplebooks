<template>
  <div class="upload">
    <h1>This is the Upload page</h1>
    <div class="text-center">
        <p class="lead">Make sure your columns are in the following order from left to right:</p>
        <p>Date, Description, Withdrawn, Deposited, Balance</p>
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
    </div>
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
            const selectedFile = event.target.files[0];
            const correctSize = selectedFile.size < 1000000;
            if (selectedFile.name.split('.').pop() === 'csv' && selectedFile.type === 'application/vnd.ms-excel' && correctSize){
                this.selectedFile = selectedFile;
            }
            else{
                this.clientResponseClass = 'danger text-center';
                this.clientResponse = 'Wrong file type(.csv only) or file too large (1 mb limit)';
                setTimeout(() => {this.clientResponseClass = null; this.clientResponse = null}, 10000);
            }
        },
        onUpload() {
            if (!this.selectedFile){
                this.clientResponseClass = 'warning text-center';
                this.clientResponse = 'Please select a file';
                setTimeout(() => {this.clientResponseClass = null; this.clientResponse = null}, 3000);
            }else{
                const formData = new FormData()
                formData.append('bank', this.selectedFile)
                axios.post('http://localhost:5000/transactions/upload', formData)
                    .then(response => {
                        if (response.status === 201){
                        this.clientResponseClass = 'success text-center';
                        this.clientResponse = 'Files Uploaded!';
                        setTimeout(() => {this.clientResponseClass = null; this.clientResponse = null}, 3000);
                        }
                    })
                    .catch(error => {
                        if (error.response.status === 415){
                            this.clientResponseClass = 'danger text-center';
                            this.clientResponse = 'Invalid file type';
                            setTimeout(() => {this.clientResponseClass = null; this.clientResponse = null}, 10000);
                        }else if (error.response.status === 413){
                            this.clientResponseClass = 'danger text-center';
                            this.clientResponse = 'File too large (1 mb limit)';
                            setTimeout(() => {this.clientResponseClass = null; this.clientResponse = null}, 10000);
                        }
                    })
            }
        }
    }
}
</script>

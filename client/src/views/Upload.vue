<template>
  <div class="upload text-center">
    <h1 class="mt-5">Upload your documents</h1>
    <div class="">
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
                {{ clientResponse }}
            </b-alert>
        </div>
    </div>

  </div>
</template>
<script>
import api from '../services/api';

export default{
    data () {
        return {
            selectedFile: null,
            clientResponse: null,
            clientResponseClass: null,
        }
    },
    methods: {
        onFileChanged (event) {
            const selectedFile = event.target.files[0];
            // const fileName = selectedFile.name;
            // console.log('name ',fileName);
            // console.log('file ',selectedFile);
            const correctSize = selectedFile.size < 1000000;
            if (selectedFile.name.split('.').pop() === 'csv' && selectedFile.type === 'application/vnd.ms-excel' && correctSize){
                this.selectedFile = selectedFile;
            }else if (selectedFile.name.split('.').pop() === 'csv' && selectedFile.type === 'text/csv' && correctSize){
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
                console.log(formData);
                api().post('transactions/upload', formData)
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

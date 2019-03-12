<template>
  <div class="upload text-center">
      <h1 class="text-danger mt-5">THIS IS FOR DEMONSTRATION PURPOSES ONLY</h1>
      <h2 class="text-danger">DO NOT UPLOAD PERSONAL DATA</h2>
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
import parse from 'csv-parse';

export default{
    data () {
        return {
            selectedFile: null,
            preparedTransactions: null,
            clientResponse: null,
            clientResponseClass: null,
        }
    },
    methods: {
        onFileChanged (event) {
            const selectedFile = event.target.files[0];
            // Validating file type
            const reader = new FileReader();
            reader.onload = () => {
                parse(reader.result, (err, data) => {
                    if(err){
                        this.clientResponseClass = 'danger text-center';
                        this.clientResponse = 'Wrong file type(.csv only)';
                        setTimeout(() => {this.clientResponseClass = null; this.clientResponse = null}, 10000);
                        return;
                    }
                    return;
                }
            );
            }
            reader.readAsText(selectedFile)

            const correctSize = selectedFile.size < 1000000;
            if (correctSize){
                this.selectedFile = selectedFile;
            }
            else{
                this.clientResponseClass = 'danger text-center';
                this.clientResponse = 'File too large (1 mb limit)';
                setTimeout(() => {this.clientResponseClass = null; this.clientResponse = null}, 10000);
            }
        },
        setTransactions(){
            let preparedTransactions;
            const reader = new FileReader();
            reader.onload = async () => {
                parse(reader.result, (err, data) => {
                    if(err){
                        this.clientResponseClass = 'danger text-center';
                        this.clientResponse = 'Wrong file type(.csv only)';
                        setTimeout(() => {this.clientResponseClass = null; this.clientResponse = null}, 10000);
                        return;
                    }
                    preparedTransactions = data.map(row => (
                            {
                                transaction_date: row[0],
                                description: row[1],
                                withdrawl: row[2],
                                deposit: row[3],
                                balance: row[4]
                            }
                        )
                    );
                    this.uploaded = preparedTransactions;
                    this.$store.dispatch('extendTransactions', preparedTransactions)
                }
            );
            }
            reader.readAsText(this.selectedFile)
        },
        onUpload() {
            if (!this.selectedFile){
                this.clientResponseClass = 'warning text-center';
                this.clientResponse = 'Please select a file';
                setTimeout(() => {this.clientResponseClass = null; this.clientResponse = null}, 3000);
            }else{
                this.setTransactions();
                const formData = new FormData();
                formData.append('bank', this.selectedFile);
                this.$router.push('transactions');
                console.log('a');
                api.post('transactions/upload', formData)
                console.log('b');
                    // .then(response => {
                    //     if (response.status === 201){
                    //         console.log('done');
                    //     this.clientResponseClass = 'success text-center';
                    //     this.clientResponse = 'Files Uploaded!';
                    //     setTimeout(() => {this.clientResponseClass = null; this.clientResponse = null}, 3000);
                    //     }
                    // })
                    // .catch(error => {
                    //     if (error.response.status === 415){
                    //         this.clientResponseClass = 'danger text-center';
                    //         this.clientResponse = 'Invalid file type';
                    //         setTimeout(() => {this.clientResponseClass = null; this.clientResponse = null}, 10000);
                    //     }else if (error.response.status === 413){
                    //         this.clientResponseClass = 'danger text-center';
                    //         this.clientResponse = 'File too large (1 mb limit)';
                    //         setTimeout(() => {this.clientResponseClass = null; this.clientResponse = null}, 10000);
                    //     }
                    // });
            }
        }
    }
}
</script>

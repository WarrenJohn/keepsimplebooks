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
        <label class="btn btn-xs btn-primary">
        <input type="file" name="attachment[]" id="fileId" accept=".csv" @change="onFileSelected" multiple/>
        Upload file
        </label>
        <br>
        {{selectedFile}}

  </div>
</template>
<script>
import axios from 'axios'

export default{
    name: 'Uploads',
        props: {
            selected: String
        },
    data () {
        return {
            fileName: null,
            selectedFile: null
        }
    },
    methods: {
        onFileSelected(event){
            const fileData =  event.target.files[0];
            this.selectedFile = fileData.name
        },
        sendFile: function(){

        }
    }
}
</script>

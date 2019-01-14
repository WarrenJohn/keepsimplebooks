<template>
  <div class="upload">
    <h1>This is the Upload page</h1>
    <ul>
        <li>Select the file</li>
        <li>Tag the columns</li>
        <li>Confirm the upload</li>
    </ul>
        <form method="post" enctype="multipart/form-data">
            <input type="file" accept=".csv" name="uploads" @change="onFileSelected" multiple>
            <input type="submit" value="Upload">
        </form>

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
            selectedFiles: null,
        }
    },
    methods: {
        onFileSelected: function(event){
            this.selectedFiles = event.target.files
        },
        sendFile: function(){

        }
    }
}
</script>

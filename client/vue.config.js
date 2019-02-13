module.exports = {
    devServer: {
        proxy:{
            '/API/':{
                target:'http://localhost:5000'
            }
        }
    }
}

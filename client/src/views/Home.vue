<template>
  <div class="home">
    <div class="container" style="padding-right:6rem; padding-left:6rem">
        <b-row>
            <b-col class="text-center mt-5" style="padding-top:10rem">
                <h1>Balance your books the simple way</h1>
                <p class="lead">No more fiddling with over complicated bookkeeping software that requires hours of time and energy to learn</p>
                <p>Save time, energy, and automate your books.</p>
                    <a href="#howitworks"><b-btn class="mr-5" variant="link">How it works</b-btn></a>
                    <b-btn variant="link" to="register">Get started now</b-btn>
            </b-col>
            <b-col class="text-center mt-5">
                <img src="../assets/logo.png" />
            </b-col>
        </b-row>
        <b-dropdown-divider class="mt-5 mb-5"></b-dropdown-divider>
        <b-dropdown-divider class="mt-5 mb-5"></b-dropdown-divider>
        <b-row>
            <b-col class="text-center text-muted">
                <h1>Bookkeeping made simple, on purpose!</h1>
                <p class="lead">Intentionally designed to be as simple as possible, to get you organised in less than an hour.</p>
            </b-col>
        </b-row>
        <b-dropdown-divider class="mt-5 mb-5"></b-dropdown-divider>
        <b-dropdown-divider class="mt-5 mb-5"></b-dropdown-divider>
        <b-row>
            <b-col class="text-center text-muted">
                <h1>Bookkeeping Services for Small Business, Independent Contractors and Landlords</h1>
                <p class="lead">Easily organise all your banking transactions, so you know where your money is going. Identify your excess expenses,
                     and see your income</p>
            </b-col>
        </b-row>
        <b-dropdown-divider class="mt-5 mb-5"></b-dropdown-divider>
        <b-dropdown-divider class="mt-5 mb-5"></b-dropdown-divider>
        <b-row>
            <b-col class="text-center">
                <h1><a name="howitworks">How it works</a></h1>
            </b-col>
        </b-row>
        <b-row class="text-center mt-5">

            <b-col class="text-muted">
                <h3>Aquiring documents</h3>
                <p class="lead text-primary">"chequing.csv"</p>
                <p>Upload a .csv with your banking transactions</p>
            </b-col>
        </b-row>
        <b-row class="text-center mt-5">
            <b-col class="text-muted">
                <h3>Create a category</h3>
                <p class="lead text-primary">"MORTGAGE PAYMENT"</p>
                <p>Tagged transactions will be sorted under the selected category, and show you the net total.</p>
            </b-col>
        </b-row>
        <b-row class="text-center mt-5">
            <b-col class="text-muted">
                <h3>Tag a transaction under that category</h3>
                <p>Tag by the complete transaction description, and the exact amount, just the amount, or just a portion of the text. </p>
                <p>Original Transaction:</p>
                <b-alert variant="warning" show>
                    <p class="lead text-primary mt-3">13124RBC PMT MTG | $500</p>
                </b-alert>
                <p>Tagged Transaction</p>
                <b-alert show>
                    <p class="lead">Category: <b class="text-primary">MORTGAGE</b></p>
                    <p class="lead">Description: <b class="text-primary">RBC PMT MTG</b></p>
                    <p class="lead">Amount: <b class="text-primary">$500</b></p>
                </b-alert>
            </b-col>
        </b-row>
        <b-row class="mt-5">
            <b-col>
                <b-alert show>
                    <center>
                        <table size="lg">
                            <thead>
                                <tr>
                                    <th scope="col" class="lead">Name</th>
                                    <th scope="col" class="lead">Amount</th>
                                </tr>
                            </thead>
                            <tr>
                                <td>COMMISSIONS INCOME</td>
                                <td class="lead">$62,104.15</td>
                            </tr>
                            <tr>
                                <td>123 MAIN ST RENTAL INCOME</td>
                                <td class="lead">$24,220.84</td>
                            </tr>
                            <tr>
                                <td>123 MAIN ST MORTGAGE</td>
                                <td class="lead text-danger">$(11,021.52)</td>
                            </tr>
                            <tr>
                                <td>PROPERTY TAX</td>
                                <td class="lead text-danger">$(3,455.50)</td>
                            </tr>
                            <tr>
                                <td>HOME INSURANCE</td>
                                <td class="lead text-danger">$(1,228.11)</td>
                            </tr>
                            <tr>
                                <td>CAR INSURANCE</td>
                                <td class="lead text-danger">$(1,257.36)</td>
                            </tr>
                            <tr>
                                <td>GYM MEMBERSHIP</td>
                                <td class="lead text-danger">$(108.45)</td>
                            </tr>
                        </table>
                    </center>
                </b-alert>
            </b-col>
        </b-row>
        <b-dropdown-divider class="mt-5 mb-5"></b-dropdown-divider>
        <b-dropdown-divider class="mt-5 mb-5"></b-dropdown-divider>
        <b-row>
            <b-col class="text-center">
                <b-btn variant="link" to="register"><h4>Get started now</h4></b-btn>
            </b-col>
        </b-row>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
    name: 'home',
    components: {
    },
    data(){
        return{
        }
    }
}
</script>
<style>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

<template>
  <v-dialog v-model="form.open" persistent max-width="850px">
    <v-card>
      <v-card-title>
        <span class="headline">User Form</span>
      </v-card-title>
      <v-divider></v-divider>
      <template>
        <v-card-text>
          <v-container grid-list-md fluid>
            <v-layout row justify-center>
              <v-flex xs10 md8>
                <v-text-field
                  label="Lastname *"
                  v-model="user.lastname"
                  :rules="[rules.required]"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row justify-center>
              <v-flex xs10 md8>
                <v-text-field
                  label="Firstname *"
                  v-model="user.firstname"
                  :rules="[rules.required]"
                  color="primary"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row justify-center>
              <v-flex xs10 md8>
                <v-text-field
                  label="Email *"
                  v-model="user.email"
                  :rules="[rules.required, rules.email]"
                  color="primary"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row justify-center>
              <v-flex xs10 md8>
                <v-text-field
                  label="Age *"
                  v-model="user.age"
                  mask="###"
                  suffix="years"
                  color="primary"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row justify-center>
              <v-flex xs10 md8>
                <v-text-field
                  label="Phone # (###) ### - ## - ##"
                  v-model="user.phone"
                  mask="+# (###) ### - ## - ##"
                  color="primary"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row justify-center>
              <v-flex xs10 md8>
                 <v-textarea
                  label="Address"
                  v-model="user.address"
                  color="primary"
                ></v-textarea>
              </v-flex>
            </v-layout>            
          </v-container>          
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn color="blue darken-1" flat @click="close()">Отмена</v-btn>
          <v-btn color="blue darken-1" flat :disabled="true">Сохранить</v-btn>
        </v-card-actions>
      </template>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      loading: false,
      rules: {
        required: value => !!value || "Required",
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalid e-mail.";
        }
      }
    };
  },
  methods: {
      close() {
           this.$store.commit("TOGGLE_FORM");
      }
  },
  computed: {
    ...mapState(["form"]),
    user: {
      get: function() {
        return this.$store.getters.user;
      },
      set: function(value) {
        
      }
    }
  }
};
</script>

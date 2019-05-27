<template>
  <v-dialog v-model="form.open" persistent fullscreen>
    <v-card>
      <v-card-title>
        <span class="headline">User Form</span>
      </v-card-title>
      <v-divider></v-divider>
      <template>
        <v-form ref="form">
          <v-card-text>
            <v-container grid-list-md fluid>
              <v-layout row justify-center>
                <v-flex xs10 md8>
                  <v-text-field
                    label="Lastname*"
                    v-model="user.lastname"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row justify-center>
                <v-flex xs10 md8>
                  <v-text-field
                    label="Firstname*"
                    v-model="user.firstname"
                    :rules="[rules.required]"
                    color="primary"
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row justify-center>
                <v-flex xs10 md8>
                  <v-text-field
                    label="Email*"
                    v-model="user.email"
                    :rules="[rules.required, rules.email]"
                    color="primary"
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row justify-center>
                <v-flex xs10 md8>
                  <v-text-field
                    label="Age*"
                    v-model="user.age"
                    :rules="[rules.required, rules.age]"
                    mask="###"
                    suffix="years"
                    color="primary"
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row justify-center>
                <v-flex xs10 md8>
                  <v-text-field
                    label="Phone* ex: (###) ### ####"
                    v-model="user.phone"
                    :rules="[rules.required, rules.phoneNumber]"
                    mask="(###) ### ####"
                    color="primary"
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row justify-center>
                <v-flex xs10 md8>
                  <v-textarea label="Address" v-model="user.address" color="primary"></v-textarea>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn color="blue darken-1" flat @click="close()">Cancel</v-btn>
            <v-btn color="blue darken-1" flat :disabled="true">Save</v-btn>
          </v-card-actions>
        </v-form>
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
        },
        age: value => {
            return parseInt(value) != NaN || "Age must be Number";
        },
        phoneNumber: value => {
            const pattern = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-/\s\.]?[0-9]{4,6}$/im;
            return pattern.test(value) || "Invalid phone number.";
        }
      }
    };
  },
  methods: {
    reset() {
      this.$refs.form.reset();
      this.$store.commit("CLEAR_USER_FORM");
    },
    close() {
      this.$store.commit("TOGGLE_FORM");
      this.reset();
    }
  },
  computed: {
    ...mapState(["form"]),
    user: {
      get: function() {
        return this.$store.getters.user;
      }
    }
  }
};
</script>

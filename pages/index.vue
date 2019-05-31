<template>
  <div id="pageTable">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex sm8>
          <h3>User Datatable</h3>
        </v-flex>
        <v-flex sm4>
          <v-btn color="darken-2" @click="openUserForm()">Add New User</v-btn>
        </v-flex>
        <v-flex lg12>
          <v-card>
            <v-toolbar card color="white">
              <v-text-field
                flat
                solo
                prepend-icon="search"
                placeholder="Type something"
                v-model="search"
                hide-details
                class="hidden-sm-and-down"
              ></v-text-field>
              <v-chip
                close
                v-model="ageFilter.chip"
                @input="onAgeFilterRemove()"
              >Age Range: {{ageFilter.value[0]}} - {{ageFilter.value[1]}}</v-chip>
              <!--  FILTER SELECTION -->
              <v-menu
                v-model="ageFilter.menu"
                :close-on-click="false"
                :close-on-content-click="false"
                offset-x
                origin="center center"
                :nudge-width="350"
                :nudge-bottom="40"
                :nudge-left="200"
                transition="scale-transition"
              >
                <template v-slot:activator="{ on }">
                  <v-btn icon v-on="on">
                    <v-icon>filter_list</v-icon>
                  </v-btn>
                </template>

                <v-card>
                  <v-list>
                    <v-list-tile avatar>
                      <v-list-tile-avatar>
                        <v-icon>filter_list</v-icon>
                      </v-list-tile-avatar>

                      <v-list-tile-content>
                        <v-list-tile-title>Age Filter</v-list-tile-title>
                      </v-list-tile-content>
                    </v-list-tile>
                  </v-list>

                  <v-divider></v-divider>

                  <v-card-text>
                    <v-layout row justify-center>
                      <v-flex sm10 class="mt-4 px-2">
                        <v-range-slider
                          v-model="ageFilter.value"
                          :max="ageFilter.max"
                          :min="ageFilter.min"
                          :step="1"
                          thumb-label="always"
                          ticks
                        ></v-range-slider>
                      </v-flex>
                    </v-layout>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn flat @click="closeAgeFilterMenu()">Cancel</v-btn>
                    <v-btn color="primary" flat @click="searchByAgeInterval()">Save</v-btn>
                  </v-card-actions>
                </v-card>
              </v-menu>
              <!--  COLUMN SELECTION -->
              <v-menu
                :close-on-content-click="false"
                offset-y
                origin="center center"
                :nudge-right="20"
                :nudge-bottom="10"
                transition="scale-transition"
              >
                <v-btn icon slot="activator">
                  <v-icon>more_vert</v-icon>
                </v-btn>
                <v-list id="context_menu">
                  <template v-for="(column, index) in complex.columnsVisible">
                    <v-list-tile :key="index">
                      <v-list-tile-content>
                        <v-checkbox
                          primary
                          v-model="complex.columnsSelected"
                          :label="column"
                          :value="column"
                        ></v-checkbox>
                      </v-list-tile-content>
                    </v-list-tile>
                  </template>
                </v-list>
              </v-menu>
            </v-toolbar>
            <v-divider></v-divider>
            <v-card-text class="pa-0">
              <v-data-table
                :headers="computedHeaders"
                :items="users.items"
                class="elevation-1"
                hide-actions
                must-sort
              >
                <template slot="items" slot-scope="props">
                  <td>{{ props.index + 1 }}</td>
                  <td
                    v-if="complex.columnsSelected.indexOf('Firstname') != -1"
                    v-html="highlightMatches(props.item.firstname)"
                  ></td>
                  <td
                    v-if="complex.columnsSelected.indexOf('Lastname') != -1"
                    v-html="highlightMatches(props.item.lastname)"
                  ></td>
                  <td
                    v-if="complex.columnsSelected.indexOf('Age') != -1"
                    v-html="highlightMatches(props.item.age)"
                  ></td>
                  <td
                    v-if="complex.columnsSelected.indexOf('Address') != -1"
                    v-html="highlightMatches(props.item.address.full)"
                  ></td>
                  <td
                    v-if="complex.columnsSelected.indexOf('Email') != -1"
                    v-html="highlightMatches(props.item.email)"
                  ></td>
                  <td 
                    v-if="complex.columnsSelected.indexOf('Phone') != -1"
                    v-html="highlightMatches(props.item.phone)"
                  ></td>
                  <td>
                    <v-btn
                      depressed
                      outline
                      icon
                      fab
                      dark
                      color="primary"
                      small
                      @click="onEdit(props.item.uuid)"
                    >
                      <v-icon>edit</v-icon>
                    </v-btn>
                    <v-btn
                      depressed
                      outline
                      icon
                      fab
                      dark
                      color="pink"
                      small
                      @click="onRemove(props.item.uuid)"
                    >
                      <v-icon>delete</v-icon>
                    </v-btn>
                  </td>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
      <v-layout v-show="users.loading" row wrap align-center justify-center ma-0 pb-4>
        <v-progress-circular :size="40" color="primary" indeterminate ma-auto></v-progress-circular>
      </v-layout>
    </v-container>
    <user-form></user-form>
    <snackbar :show="show" :text="snackbarMessage" :color="snackbarColor"></snackbar>
  </div>
</template>

<script>
import UserForm from "@/components/UserForm";
import Snackbar from "@/components/Snackbar";
import UserAPI from "@/api/users";

import { mapState } from "vuex";

export default {
  components: {
    UserForm,
    Snackbar
  },
  data() {
    return {
      mounted: false,
      bottom: false,
      loading: false,
      search: "",
      ageFilter: {
        menu: false,
        chip: false,
        value: [18, 60],
        min: 18,
        max: 60
      },
      complex: {
        columnsVisible: [
          "Firstname",
          "Lastname",
          "Age",
          "Address",
          "Email",
          "Phone"
        ],
        columnsSelected: [],
        headers: [
          {
            text: "№",
            align: "center",
            value: "serial",
            sortable: false,
            width: "3%"
          },
          {
            text: "Firstname",
            value: "firstname"
          },
          {
            text: "Lastname",
            value: "lastname"
          },
          {
            text: "Age",
            value: "age"
          },
          {
            text: "Address",
            value: "address.full"
          },
          {
            text: "Email",
            value: "email"
          },
          {
            text: "Phone",
            value: "phone"
          },
          {
            text: "Action",
            value: "",
            sortable: false
          }
        ],
        items: []
      }
    };
  },
  created() {
    this.fetchUsers();
  },
  mounted() {
    this.mounted = true;
    this.complex.columnsSelected = [...this.complex.columnsVisible];
    window.addEventListener("scroll", () => {
      this.bottom = this.bottomVisible();
    });
  },
  methods: {
    fetchUsers() {
      this.$store.dispatch("LOAD_USERS");
    },
    searchBy(searchStr) {
      this.$store.dispatch("SEARCH_BY_TEXT", searchStr);
    },
    onAgeFilterRemove() {
      this.ageFilter.chip = false;
      this.ageFilter.value = [18, 60];
      this.$store.dispatch("RESET_SEARCH_AGE_FILTER");
    },
    onEdit(uuid) {
      this.openUserForm();
      this.$store.dispatch("FETCH_USER", uuid);
    },
    onRemove(uuid) {
      this.$store.dispatch("REMOVE_USER", uuid);
    },
    openUserForm() {
      this.$store.commit("TOGGLE_FORM");
    },
    searchByAgeInterval() {
      this.ageFilter.menu = false;
      this.ageFilter.chip = true;
      this.$store.dispatch("SEARCH_BY_AGE_INTERVAL", this.ageFilter.value);
    },
    closeAgeFilterMenu() {
      this.ageFilter.menu = false;
      this.ageFilter.chip = false;
      this.ageFilter.value = [18, 60];
      this.$store.dispatch("RESET_SEARCH_AGE_FILTER");
    },
    onScroll(e) {},
    bottomVisible() {
      const scrollY = window.scrollY;
      const visible = document.documentElement.clientHeight;
      const pageHeight = document.documentElement.scrollHeight;
      const bottomPage = visible + scrollY >= pageHeight;
      return bottomPage || pageHeight < visible;
    },
    highlightMatches(prop) {
      if (!prop) return "";
      let text = prop.toString().substr(),
        startIndx = text.indexOf(this.search);
      if (startIndx >= 0) {
        let matches = text.substr(startIndx, this.search.length),
          spanBlock = `<span style="color:#f49841;font-weight:900;">${matches}</span>`;
        text = text.replace(this.search, spanBlock);
      }
      return text;
    }
  },
  computed: {
    ...mapState({
      snackbarMessage(state) {
        return state.notification.message
          ? state.notification.message.substr()
          : "No info";
      },
      snackbarColor(state) {
        return state.notification.color.substr();
      },
      show: state => state.notification.show
    }),
    computedHeaders() {
      return this.complex.headers.filter(head => {
        if (head.text === "№" || head.text === "Action") return true;
        return this.complex.columnsSelected.indexOf(head.text) != -1;
      });
    },
    users: {
      get() {
        return this.$store.getters.users;
      }
    },
    pagination: {
      get() {
        return this.$store.getters.pagination;
      }
    }
  },
  watch: {
    search(str) {
      this.searchBy(str);
    },
    bottom(bottom) {
      if (bottom) {
        if (!this.pagination.end) this.fetchUsers();
      }
    }
  }
};
</script>

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
              <v-btn icon>
                <v-icon>filter_list</v-icon>
              </v-btn>
            </v-toolbar>
            <v-divider></v-divider>
            <v-card-text class="pa-0">
              <v-data-table
                :headers="complex.headers"
                :items="complex.items"
                class="elevation-1"
                v-model="complex.selected"
                hide-actions
                must-sort
              >
                <template slot="items" slot-scope="props">
                  <!-- <td>
                    <v-checkbox primary hide-details v-model="props.selected"></v-checkbox>
                  </td>-->
                  <td>{{ props.index + 1 }}</td>
                  <td>{{ props.item.firstname }}</td>
                  <td>{{ props.item.lastname }}</td>
                  <td>{{ props.item.age }}</td>
                  <td>{{ props.item.address.full }}</td>
                  <td>{{ props.item.email }}</td>
                  <td>{{ props.item.phone }}</td>
                  <td>
                    <v-btn depressed outline icon fab dark color="primary" small>
                      <v-icon>edit</v-icon>
                    </v-btn>
                    <v-btn depressed outline icon fab dark color="pink" small>
                      <v-icon>delete</v-icon>
                    </v-btn>
                  </td>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
      <v-layout v-if="loading" row wrap align-center justify-center ma-0 pb-4>
        <v-progress-circular :size="40" color="primary" indeterminate ma-auto></v-progress-circular>
      </v-layout>
    </v-container>
    <user-form></user-form>
  </div>
</template>

<script>
import UserForm from "@/components/UserForm";
import UserAPI from "@/api/users";

export default {
  components: {
    UserForm
  },
  data() {
    return {
      search: "",
      searchFilter: {
        offset: 0
      },
      pagination: {
        offset: 0,
        limit: 10,
        end: false
      },
      bottom: false,
      loading: false,
      mounted: false,
      complex: {
        selected: [],
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
    window.addEventListener("scroll", () => {
      this.bottom = this.bottomVisible();
    });
  },
  methods: {
    async fetchUsers() {
      if (!this.pagination.end && !this.loading) {
        this.loading = true;
        const finded = await UserAPI.getUsers(
          this.pagination.offset,
          this.pagination.limit
        );
        if (finded.length) {
          this.complex.items = [...this.complex.items, ...finded]; // join
          this.pagination.offset =
            this.pagination.offset + this.pagination.limit;
        } else {
          this.pagination.end = true;
        }
        this.loading = !this.loading;
      }
    },
    async searchBy(searchStr) {
      this.complex.items = [];
      if (!searchStr) return this.fetchUsers();
      const response = UserAPI.getUsersBySearch(
        searchStr,
        this.searchFilter.offset,
        this.pagination.limit
      );
      if (response.users.length) {
        this.complex.items = [...this.complex.items, ...response.users]; // join
        this.searchFilter.offset =
          this.searchFilter.offset + this.pagination.limit;
      }
    },
    openUserForm() {
      this.$store.commit("TOGGLE_FORM");
    },
    bottomVisible() {
      const scrollY = window.scrollY;
      const visible = document.documentElement.clientHeight;
      const pageHeight = document.documentElement.scrollHeight;
      const bottomPage = visible + scrollY >= pageHeight;
      return bottomPage || pageHeight < visible;
    }
  },
  computed: {
    fabBtnStyle() {
      return "top: 15px; right: 25px;";
    }
  },
  watch: {
    search(str) {
      this.pagination.offset = 0;
      this.pagination.end = false;
      this.searchFilter.offset = 0;
      this.searchBy(str);
    },
    bottom(bottom) {
      if (bottom) {
        if (!this.pagination.end && !this.search) this.fetchUsers();
      }
    }
  }
};
</script>

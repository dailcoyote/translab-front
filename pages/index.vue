<template>
  <div id="pageTable">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex sm12>
          <h3>User Datatable</h3>
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
                  <td>{{ props.item.address.country + ',' + props.item.address.city + ',' + props.item.address.street }}</td>
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
    </v-container>
  </div>
</template>

<script>
import UserAPI from "@/api/users";
export default {
  components: {},
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
            value: "address.country+address.city"
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
    window.addEventListener("scroll", () => {
      this.bottom = this.bottomVisible();
    });
  },
  methods: {
    fetchUsers() {
      if (!this.pagination.end) {
        const finded = UserAPI.getUsers(
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
      }
    },
    searchBy(searchStr) {      
      this.complex.items = [];
      if(!searchStr) return this.fetchUsers();        
      const response = UserAPI.getUsersBySearch(
        searchStr,
        this.searchFilter.offset,
        this.pagination.limit
      );
      if (response.users.length) {
        this.complex.items = [...this.complex.items, ...response.users]; // join
        this.searchFilter.offset =
          this.searchFilter.offset + this.pagination.limit;
      } else {
        this.pagination.offset = 0;
        this.searchFilter.offset = 0;
      }
    },
    bottomVisible() {
      const scrollY = window.scrollY;
      const visible = document.documentElement.clientHeight;
      const pageHeight = document.documentElement.scrollHeight;
      const bottomPage = visible + scrollY >= pageHeight;
      return bottomPage || pageHeight < visible;
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

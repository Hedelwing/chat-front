<template>
  <app-layot>
    <template v-slot:header>
      <v-toolbar-title>Друзья</v-toolbar-title>
      <v-spacer></v-spacer>
      <div v-show="friendsModel.length">
        <v-dialog v-model="removeDialog" max-width="290">
          <ConfirmAction
            @cancel="cancelRemoving"
            @accept="acceptRemoving"
          ></ConfirmAction>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" color="deep-purple" icon>
              <v-icon title="Удалить из друзей">mdi-account-remove</v-icon>
            </v-btn>
          </template>
        </v-dialog>
        <v-dialog v-model="dialog" max-width="290">
          <v-card>
            <v-card-title class="text-h5">Новый чат</v-card-title>
            <v-card-text>
              <v-text-field v-model="chatTitle" placeholder="Введите название">
              </v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-btn block :disabled="!chatTitle" @click="createChat">Ок</v-btn>
            </v-card-actions>
          </v-card>
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="deep-purple" icon v-bind="attrs" v-on="on">
              <v-icon title="Начать чат">mdi-message-plus</v-icon>
            </v-btn>
          </template>
        </v-dialog>
      </div>
    </template>
    <v-list v-if="friends.length">
      <v-list-item-group v-model="friendsModel" multiple>
        <v-list-item
          v-for="friend in friends"
          :key="friend.id"
          :value="friend.id"
        >
          <template v-slot="{ active }">
            <v-list-item-avatar>
              <v-img :src="friend.avatar"></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title v-text="friend.nickname"></v-list-item-title>
              <v-list-item-subtitle
                v-text="friend.email"
              ></v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-checkbox :input-value="active" color="deep-purple"></v-checkbox
            ></v-list-item-action>
          </template>
        </v-list-item>
      </v-list-item-group>
    </v-list>
    <div v-else-if="$apollo.queries.friends.loading">
      <v-skeleton-loader
        v-for="i in 10"
        :key="i"
        type="list-item-avatar-two-line"
      ></v-skeleton-loader>
    </div>
    <div class="text-center caption my-4" v-else>У вас пока нет друзей</div>
  </app-layot>
</template>

<script>
import { createChat } from "../graphql/CreateChat";
import GetChats from "../graphql/GetChats";
import CancelFriendship from "../graphql/CancelFriendship";
import friends from "../graphql/Friends";
import AppLayot from "../components/AppLayot.vue";
import ConfirmAction from "../components/ConfirmAction.vue";
import { setIn, updateStore } from "../utils";

export default {
  data() {
    return {
      dialog: false,
      chatTitle: "",
      friends: [],
      friendsModel: [],
      removeDialog: false,
    };
  },
  components: {
    AppLayot,
    ConfirmAction,
  },
  methods: {
    closeDialog() {
      this.dialog = false;
    },
    cancelRemoving() {
      this.removeDialog = false;
    },
    acceptRemoving() {
      this.removeDialog = false;
      this.cancelFriendship();
      this.friendsModel = [];
    },
    createChat() {
      this.$apollo
        .mutate({
          mutation: createChat,
          variables: {
            title: this.chatTitle,
            members: this.friendsModel,
          },
          update: (store, { data: { createChat } }) => {
            const data = store.readQuery({ query: GetChats });

            data.chats.unshift(createChat);

            store.writeQuery({ query: GetChats, data });
          },
        })
        .then(({ data: { createChat } }) => {
          this.$router.push(`/chats/${createChat.id}`);
        });
    },
    cancelFriendship() {
      this.$apollo.mutate({
        mutation: CancelFriendship,
        variables: {
          ids: this.friendsModel,
        },
        update(store, { data }) {
          const updateFriends = (data, { cancelFriendship }) =>
            setIn(
              data,
              "friends",
              data.friends.filter(
                (friend) => !cancelFriendship.includes(friend.id)
              )
            );

          updateStore(store, { query: friends }, data, updateFriends);
        },
      });
    },
  },
  apollo: {
    friends: {
      query: friends,
    },
  },
};
</script>
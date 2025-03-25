<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AuthService from '../services/authService';
import TeamService, { ExecDetails } from '../services/teamService';

const authService = new AuthService();
const teamService = new TeamService();

const showUpdateExecModal = ref<boolean>(false);
const showDeleteExecModal = ref<boolean>(false);
const execCards = ref<ExecDetails[]>([]);
const currentExecDetails = ref<ExecDetails>();
const currentExecId = ref<string>();

const defaultExecDetails: ExecDetails = {
    _id: '',
    image: '',
    name: '',
    position: '',
    description: '',
}

const loadExecCards = async () => {
    try {
        execCards.value = await teamService.getAllExecDetails();
    } catch (err) {
        console.log(err)
    }
}

onMounted(async () => {
    loadExecCards();
})

const checkUserRoleIsAdmin = (): boolean => {
    const userRole = authService.getUserRole();

    if (userRole && userRole === "admin") {
        return true;
    }
    return false;
}

const addExecDetails = () => {
    currentExecDetails.value = JSON.parse(JSON.stringify(defaultExecDetails)); // Deep copying detault exec values
    showUpdateExecModal.value = true;
}

const editExecDetails = (index: number) => {
    currentExecDetails.value = execCards.value[index];
    showUpdateExecModal.value = true;
}

const deleteExecDetails = (index: number) => {
    currentExecId.value = execCards.value[index]._id;
    showDeleteExecModal.value = true;
}
</script>

<template>
    <div id="about" class="font-lexand">
        <BContainer>
            <h1 class="pt-5 d-flex justify-content-center align-items-center">Meet Our Exec Team</h1>
            <BButton v-if="checkUserRoleIsAdmin()" class="beige-button" @click="addExecDetails">Add Exec</BButton>
            <BRow class="d-flex justify-content-center exec-card-group pt-5 pb-5">
                <BCol v-for="(card, index) in execCards" :key="index" cols="12" md="6" lg="4" xl="3" class="d-flex mb-3">
                    <BCard :title="card.name" class="text-center exec-card">
                        <BCardImg
                            :src="card.image"
                            alt="Exec Image"
                            class="exec-img rounded-circle mx-auto d-block mb-1"
                        />
                        <BCardText>{{ card.position }}</BCardText>
                        <BCardText>{{ card.description }}</BCardText>
                        <BCardFooter v-if="checkUserRoleIsAdmin()">
                            <BButton class="pink-button exec-edit-margin" @click="editExecDetails(index)">Edit</BButton>
                            <BButton class="pink-button" @click="deleteExecDetails(index)">Delete</BButton>
                        </BCardFooter>
                    </BCard>
                </BCol>
            </BRow>
        </BContainer>
    </div>
    <UpdateExecModal
        v-if="showUpdateExecModal && checkUserRoleIsAdmin()"
        :execDetails="currentExecDetails!"
        :showUpdateExecModal="showUpdateExecModal" 
        @update:showUpdateExecModal="showUpdateExecModal = $event"
        @update:reload="loadExecCards()"
    />
    <DeleteExecModal
        v-if="showDeleteExecModal && checkUserRoleIsAdmin()"
        :execId="currentExecId!"
        :showDeleteExecModal="showDeleteExecModal"
        @update:showDeleteExecModal="showDeleteExecModal = $event"
        @update:reload="loadExecCards()"
    />
</template>

<style scoped>
#about {
    min-height: calc(100vh - 76px);
    background-color: #FFCCCB;
}

.exec-card-group {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    max-width: 100%;
    overflow-x: hidden;
}

.exec-card {
    background-color: #FFDCD1;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.exec-img {
    width: 100px; 
    height: 100px;
    object-fit: cover;
}

.exec-edit-margin {
    margin-right: 20px;
}
</style>

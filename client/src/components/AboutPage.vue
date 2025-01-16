<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AuthService from '../services/authService';
import TeamService, { ExecDetails } from '../services/teamService';
import DeleteExecModal from './ExecModals/DeleteExecModal.vue';

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
        const execs = await teamService.getAllExecDetails();

        execCards.value = execs.map(exec => ({
            _id: exec._id || '',
            image: exec.image || '',
            name: exec.name || '',
            position: exec.position || '',
            description: exec.description || '',
        }));
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
            <BCardGroup class="pt-5 pb-5" deck>
                <BRow class="g-3">
                    <BCol v-for="(card, index) in execCards" :key="index" cols="12" md="6" lg="4" xl="3">
                        <BCard :title="card.name" class="text-center exec-card">
                            <BCardText>{{ card.description }}</BCardText>
                            <BCardText>{{ card.position }}</BCardText>
                            <BRow>
                                <BCol>
                                    <BButton v-if="checkUserRoleIsAdmin()" class="pink-button" @click="editExecDetails(index)">Edit</BButton>
                                </BCol>
                                <BCol>
                                    <BButton v-if="checkUserRoleIsAdmin()" class="pink-button" @click="deleteExecDetails(index)">Delete</BButton>
                                </BCol>
                            </BRow>
                        </BCard>
                    </BCol>
                </BRow>
            </BCardGroup>
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

.card-container {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 1rem;
}

.exec-card {
    background-color: #FFDCD1;
}
</style>

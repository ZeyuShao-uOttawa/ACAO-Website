<script setup lang="ts">
import { reactive, ref, nextTick } from 'vue'

const form = reactive({
  email: '',
  text: '',
})
const show = ref(true)

const onSubmit = (event: any) => {
  event.preventDefault()
}

const onReset = (event: any) => {
  event.preventDefault()
  form.email = ''
  form.text = ''
  show.value = false
  nextTick(() => {
    show.value = true
  })
}
</script>

<template>
    <div class="footer font-lexand">
        <BContainer class="footer-container">
            <BRow class="d-flex icons-container">
                <BCol md="1"></BCol>
                <BCol md="2" class="d-flex flex-column justify-content-center">
                    <a class="mb-3" href="https://www.instagram.com/uottawaacao/" target="_blank">
                        <img src="../assets/instagram.png" alt="Instagram" class="icon" />
                        &nbsp&nbspInstagram
                    </a>
                    <a class="mb-3" href="https://discord.com/invite/dv9pUUfUmK" target="_blank">
                        <img src="../assets/discord.png" alt="Discord" class="icon" />
                        &nbsp&nbspDiscord
                    </a>
                    <a href="https://www.tiktok.com/@uottawaacao" target="_blank">
                        <img src="../assets/tiktok.png" alt="TikTok" class="icon" />
                        &nbsp&nbspTikTok
                    </a>
                </BCol>
                <BCol md="5"></BCol>
                <BCol md="4 d-flex flex-column justify-content-center">
                    <h5 class="mt-2">Contact Us</h5>
                    <BForm class="mb-2" @submit="onSubmit" @reset="onReset" v-if="show">
                        <BFormGroup class="mb-2">
                          <BFormInput
                            id="contact-email"
                            v-model="form.email"
                            type="email"
                            placeholder="Enter your email"
                            required
                          />
                        </BFormGroup>
                        <BFormGroup class="mb-2">
                          <BFormTextarea id="contact-message" v-model="form.text" placeholder="Enter your message here" required />
                        </BFormGroup>
                        <BButton type="submit" class="beige-button">Submit</BButton>
                      </BForm>
                </BCol>
            </BRow>
        </BContainer>
    </div>
</template>

<style scoped>
.footer {
    min-height: 250px;
    background-color: #ff8ba0;
}

.footer-container {
    min-height: 250px;
}

.icons-container {
    min-height: 250px;
}

.icon {
    width: 24px;
    height: 24px;
    cursor: pointer;
}

a {
    text-decoration: none;
    color: inherit;
    display: flex; /* Make link content align nicely */
    align-items: center; /* Vertically align icon and text */
    margin-bottom: 10px; /* Add spacing between links */
}
</style>

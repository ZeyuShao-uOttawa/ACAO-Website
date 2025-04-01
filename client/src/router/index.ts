import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import PhotoGalleryView from '../views/PhotoGalleryView.vue';

const routes = [
    { path: '/', name: 'Home', component: HomeView },
    { path: '/gallery', name: 'Photo Gallery', component: PhotoGalleryView },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to) {
        if (to.hash) {
            return {
                el: to.hash,
                behavior: 'smooth',
                top: 76,
            };
        }
        return { top: 0 };
    },
});

export default router;
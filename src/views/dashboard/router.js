

import BasicLayout from '@/layouts/BasicLayout.vue'

export default {
	path: '/dashboard',
	name: 'dashboard',
	component: BasicLayout,
	children: [
		{
			path: 'workplace',
			name: 'workplace',
			component: () => import('./module/workplace.vue')
		},
		{
			path: 'analysis',
			name: 'analysis',
			component: () => import('./module/analysis.vue')
		}
	]
}
import { AppModule } from './../app/app.module';
import { DashboardComponent } from '../app/dashboard/dashboard.component';
import { Meta, moduleMetadata } from '@storybook/angular';

export default {
	title: 'Dashboard',
	component: DashboardComponent,
	decorators: [
		moduleMetadata({
			imports: [
				AppModule
			]
		})
	]
} as Meta;

const Template = (args: DashboardComponent) => ({
	props: args,
	componet: DashboardComponent,
});

export const Dashboard = Template.bind({});



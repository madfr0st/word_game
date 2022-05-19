import { WordComponent } from './../app/word/word.component';
import { AppModule } from '../app/app.module';
import { Meta, moduleMetadata } from '@storybook/angular';

export default {
	title: 'Words',
	component: WordComponent,
	decorators: [
		moduleMetadata({
			imports: [
				AppModule
			]
		})
	]
} as Meta;

const Template = (args: WordComponent) => ({
	props: args,
	componet: WordComponent,
});

export const Words = Template.bind({});



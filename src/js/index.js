// -----------------------------------------------------------------------------
// Deps
// -----------------------------------------------------------------------------

// global
import jQuery from 'js#/lib/jquery';
// styles
import 'sass#/style.scss';
// scripts
import { demo } from 'js#/modules/demo-module';
import { form } from 'js#/modules/formData';

// -----------------------------------------------------------------------------
// Initialize
// -----------------------------------------------------------------------------

jQuery(function ($) {
    demo();
    form();
});

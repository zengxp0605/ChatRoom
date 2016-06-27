
import React from 'react';
import { render } from 'react-dom';

import { test } from 'counter';

test();

render(
    <h1> Hello World</h1>,
    document.getElementById('container')
);


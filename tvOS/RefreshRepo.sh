#!/bin/bash
dpkg-scanpackages Debs / > Packages

bzip2 -fks Packages
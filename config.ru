require 'rubygems'
require 'bundler'
Bundler.require

require 'newrelic_rpm'
NewRelic::Agent.after_fork(:force_reconnect => true)

root = ::File.dirname(__FILE__)
require ::File.join( root, 'tialite' )

run TiaLite.new

<?php

namespace Drupal\colven\Controller;

use Drupal\Core\Controller\ControllerBase;

/**
 * Controller for the test page.
 */
class TestController extends ControllerBase {

  /**
   * Renders the test page.
   */
  public function testPage() {

    $build['#attached']['library'][] = 'colven/leaflet';
    $build['#attached']['library'][] = 'colven/map_script';

    $build['#theme'] = 'test_page';

    return $build;
  }

}
